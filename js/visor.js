// Visor de capturas con zoom.
// Al hacer clic en una .captura se abre a pantalla completa, con sus marcadores.
// Zoom: rueda del ratón, pellizco, botones +/−, clic en la imagen o teclas + − 0. Esc cierra.
(function () {
  var MAX = 5;

  var visor = document.createElement('div');
  visor.className = 'visor';
  visor.hidden = true;
  visor.setAttribute('role', 'dialog');
  visor.setAttribute('aria-modal', 'true');
  visor.setAttribute('aria-label', 'Visor de imagen');
  visor.innerHTML =
    '<div class="visor-barra">' +
      '<span class="visor-titulo"></span>' +
      '<div class="visor-botones">' +
        '<button type="button" data-accion="menos" aria-label="Alejar">−</button>' +
        '<button type="button" data-accion="ajustar" class="visor-pct" aria-label="Ajustar a la pantalla">100%</button>' +
        '<button type="button" data-accion="mas" aria-label="Acercar">+</button>' +
        '<button type="button" data-accion="cerrar" aria-label="Cerrar">✕</button>' +
      '</div>' +
    '</div>' +
    '<div class="visor-escena"><div class="visor-lienzo"></div></div>' +
    '<div class="visor-ayuda">' +
      (matchMedia('(pointer: coarse)').matches
        ? 'Toca o pellizca para acercar · Arrastra para moverte'
        : 'Clic o rueda del ratón para acercar · Arrastra para moverte · Esc para cerrar') +
    '</div>';
  document.body.appendChild(visor);

  var escena = visor.querySelector('.visor-escena');
  var lienzo = visor.querySelector('.visor-lienzo');
  var titulo = visor.querySelector('.visor-titulo');
  var pct = visor.querySelector('.visor-pct');
  var s = 1, x = 0, y = 0;
  var focoAnterior = null;

  function aplicar() {
    lienzo.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
    pct.textContent = Math.round(s * 100) + '%';
    escena.classList.toggle('con-zoom', s > 1);
  }

  // Evita que la imagen se salga de la pantalla al moverla.
  function limitar() {
    var maxX = Math.max(0, (lienzo.offsetWidth * s - escena.clientWidth) / 2);
    var maxY = Math.max(0, (lienzo.offsetHeight * s - escena.clientHeight) / 2);
    x = Math.min(maxX, Math.max(-maxX, x));
    y = Math.min(maxY, Math.max(-maxY, y));
  }

  // Zoom manteniendo fijo el punto (px, py), medido desde el centro de la escena.
  function zoom(nuevo, px, py) {
    nuevo = Math.min(MAX, Math.max(1, nuevo));
    x = px - (px - x) * nuevo / s;
    y = py - (py - y) * nuevo / s;
    s = nuevo;
    limitar();
    aplicar();
  }

  function ajustar() {
    var img = lienzo.querySelector('img');
    if (!img || !img.naturalWidth) return;
    var ancho = Math.min(
      escena.clientWidth - 32,
      (escena.clientHeight - 32) * img.naturalWidth / img.naturalHeight,
      img.naturalWidth
    );
    lienzo.style.width = Math.max(ancho, 50) + 'px';
    s = 1; x = 0; y = 0;
    aplicar();
  }

  function desdeCentro(e) {
    var r = escena.getBoundingClientRect();
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
  }

  // La imagen crece desde su miniatura en la página hasta su tamaño en el visor.
  function animarEntrada(miniatura) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var t = miniatura.getBoundingClientRect();
    var r = lienzo.getBoundingClientRect();
    if (!t.width || !r.width) return;
    var dx = (t.left + t.width / 2) - (r.left + r.width / 2);
    var dy = (t.top + t.height / 2) - (r.top + r.height / 2);
    lienzo.animate([
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + (t.width / r.width) + ')' },
      { transform: 'translate(0px,0px) scale(1)' }
    ], { duration: 350, easing: 'cubic-bezier(.2, .8, .2, 1)' });
  }

  function abrir(figura) {
    var miniatura = figura.querySelector('.lienzo');
    var copia = miniatura.cloneNode(true);
    var img = copia.querySelector('img');
    img.removeAttribute('loading');
    img.draggable = false;
    lienzo.innerHTML = '';
    lienzo.appendChild(copia);
    var pie = figura.querySelector('figcaption');
    titulo.textContent = pie ? pie.textContent : '';
    focoAnterior = document.activeElement;
    visor.hidden = false;
    document.documentElement.classList.add('visor-abierto');
    function mostrar() { ajustar(); animarEntrada(miniatura); }
    if (img.complete) mostrar(); else img.onload = mostrar;
    visor.querySelector('[data-accion="cerrar"]').focus();
  }

  function cerrar() {
    visor.hidden = true;
    document.documentElement.classList.remove('visor-abierto');
    lienzo.innerHTML = '';
    if (focoAnterior) focoAnterior.focus();
  }

  // Abrir al hacer clic en cualquier captura (sin JS, el enlace abre la imagen sola).
  document.addEventListener('click', function (e) {
    var enlace = e.target.closest('.captura a');
    if (!enlace) return;
    e.preventDefault();
    abrir(enlace.closest('.captura'));
  });

  visor.querySelector('.visor-botones').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var a = b.dataset.accion;
    if (a === 'cerrar') cerrar();
    else if (a === 'mas') zoom(s * 1.5, 0, 0);
    else if (a === 'menos') zoom(s / 1.5, 0, 0);
    else if (a === 'ajustar') { s = 1; x = 0; y = 0; aplicar(); }
  });

  escena.addEventListener('wheel', function (e) {
    e.preventDefault();
    var p = desdeCentro(e);
    zoom(s * Math.exp(-e.deltaY * 0.0015), p.x, p.y);
  }, { passive: false });

  // Arrastrar para mover, pellizcar para hacer zoom, clic para acercar/ajustar.
  var punteros = new Map();
  var movido = false, inicio = null, distPrevia = 0, medioPrevio = null;

  function pinza() {
    var p = Array.from(punteros.values());
    return {
      dist: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y),
      medio: { clientX: (p[0].x + p[1].x) / 2, clientY: (p[0].y + p[1].y) / 2 }
    };
  }

  escena.addEventListener('pointerdown', function (e) {
    escena.setPointerCapture(e.pointerId);
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (punteros.size === 1) { movido = false; inicio = { x: e.clientX, y: e.clientY }; }
    if (punteros.size === 2) { var p = pinza(); distPrevia = p.dist; medioPrevio = p.medio; movido = true; }
    escena.classList.add('arrastrando');
  });

  escena.addEventListener('pointermove', function (e) {
    var previo = punteros.get(e.pointerId);
    if (!previo) return;
    punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (punteros.size === 1) {
      if (Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) > 5) movido = true;
      if (s > 1) { x += e.clientX - previo.x; y += e.clientY - previo.y; limitar(); aplicar(); }
    } else if (punteros.size === 2) {
      var p = pinza();
      x += p.medio.clientX - medioPrevio.clientX;
      y += p.medio.clientY - medioPrevio.clientY;
      var c = desdeCentro(p.medio);
      zoom(s * p.dist / distPrevia, c.x, c.y);
      distPrevia = p.dist; medioPrevio = p.medio;
    }
  });

  function soltar(e) {
    if (!punteros.delete(e.pointerId)) return;
    if (punteros.size > 0) return;
    escena.classList.remove('arrastrando');
    if (movido || e.type === 'pointercancel') return;
    var r = lienzo.getBoundingClientRect();
    var sobreImagen = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (sobreImagen) {
      if (s > 1) { s = 1; x = 0; y = 0; aplicar(); }
      else { var p = desdeCentro(e); zoom(2.5, p.x, p.y); }
    } else if (s === 1) {
      cerrar();
    }
  }
  escena.addEventListener('pointerup', soltar);
  escena.addEventListener('pointercancel', soltar);

  document.addEventListener('keydown', function (e) {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrar();
    else if (e.key === '+' || e.key === '=') zoom(s * 1.5, 0, 0);
    else if (e.key === '-') zoom(s / 1.5, 0, 0);
    else if (e.key === '0') { s = 1; x = 0; y = 0; aplicar(); }
  });

  window.addEventListener('resize', function () { if (!visor.hidden) ajustar(); });
})();
