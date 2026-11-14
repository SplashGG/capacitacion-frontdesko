// Anotaciones de las capturas.
// Al pasar el ratón por un marcador (.marca data-n="N") se muestra un globo con el texto
// del punto N de la .leyenda que va justo debajo de la captura (o, si no, la primera del paso). El texto se escribe una sola vez, en la leyenda.
// Funciona en la página y dentro del visor (js/visor.js), porque el texto viaja en data-texto.
// Lo mismo para las palabras técnicas marcadas con .termino: el globo muestra su definición del glosario.
(function () {
  // 1. Copiar a cada marcador el texto de su punto de la leyenda.
  document.querySelectorAll('.captura').forEach(function (figura) {
    var bloque = figura.closest('.paso, section');
    // Si la captura lleva su propia leyenda justo debajo, se usa esa (pasos con dos capturas).
    var siguiente = figura.nextElementSibling;
    var leyenda = siguiente && siguiente.matches('.leyenda') ? siguiente : bloque && bloque.querySelector('.leyenda');
    if (!leyenda) return;
    var textos = {};
    leyenda.querySelectorAll('li').forEach(function (li) {
      var n = li.querySelector('.n');
      if (n && n.nextElementSibling) textos[n.textContent.trim()] = n.nextElementSibling.innerHTML;
    });
    figura.querySelectorAll('.marca').forEach(function (m) {
      if (textos[m.dataset.n]) m.dataset.texto = textos[m.dataset.n];
    });
  });

  // 2. Un único globo para toda la página.
  var globo = document.createElement('div');
  globo.className = 'globo';
  globo.setAttribute('role', 'tooltip');
  globo.hidden = true;
  document.body.appendChild(globo);

  // 3. Términos (.termino): su definición se toma del glosario de la página (dl.glosario),
  // buscando el <dt> con el mismo texto (o el de data-termino). Al hacer clic, la página va a ese <dt>.
  var entradas = {};
  document.querySelectorAll('dl.glosario dt').forEach(function (dt) {
    if (dt.nextElementSibling) entradas[dt.textContent.trim().toLowerCase()] = dt;
  });
  document.querySelectorAll('.termino').forEach(function (t) {
    var dt = entradas[(t.dataset.termino || t.textContent).trim().toLowerCase()];
    if (!dt) return;
    t.dataset.def = dt.nextElementSibling.innerHTML;
    t.destino = dt;
    t.tabIndex = 0;
  });

  function mostrar(m) {
    var esTermino = !!m.dataset.def;
    globo.innerHTML = esTermino
      ? '<span><b>' + m.textContent + '</b>: ' + m.dataset.def + '</span>'
      : '<span class="n">' + m.dataset.n + '</span><span>' + m.dataset.texto + '</span>';
    globo.classList.toggle('simple', esTermino);
    globo.hidden = false;
    var r = m.getBoundingClientRect();
    var g = globo.getBoundingClientRect();
    var margen = 8;
    var izquierda = Math.min(Math.max(margen, r.left + r.width / 2 - g.width / 2), innerWidth - g.width - margen);
    var arriba = r.top - g.height - 12;
    var debajo = arriba < margen;          // sin sitio arriba: se muestra debajo del marcador
    if (debajo) arriba = r.bottom + 12;
    globo.classList.toggle('debajo', debajo);
    globo.style.left = izquierda + 'px';
    globo.style.top = arriba + 'px';
    globo.style.setProperty('--flecha', (r.left + r.width / 2 - izquierda) + 'px');
  }

  function ocultar() { globo.hidden = true; }

  document.addEventListener('pointerover', function (e) {
    if (e.pointerType !== 'mouse') return;
    var m = e.target.closest('.marca[data-texto], .termino[data-def]');
    if (m) mostrar(m);
  });
  document.addEventListener('pointerout', function (e) {
    if (e.target.closest('.marca, .termino')) ocultar();
  });
  // Términos también con el teclado (Tab muestra el globo; Enter, como el clic, lleva al glosario).
  document.addEventListener('focusin', function (e) {
    if (e.target.matches('.termino[data-def]')) mostrar(e.target);
  });
  document.addEventListener('focusout', function (e) {
    if (e.target.matches('.termino')) ocultar();
  });
  function irAlGlosario(e) {
    var t = e.target.closest && e.target.closest('.termino[data-def]');
    if (!t || (e.type === 'keydown' && e.key !== 'Enter')) return;
    ocultar();
    t.destino.scrollIntoView({ block: 'center' });
  }
  document.addEventListener('click', irAlGlosario);
  document.addEventListener('keydown', irAlGlosario);
  addEventListener('scroll', ocultar, true);
  addEventListener('wheel', ocultar, { passive: true });
  addEventListener('pointerdown', ocultar);
})();
