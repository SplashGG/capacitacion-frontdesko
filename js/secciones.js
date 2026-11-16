// Lectura guiada por secciones.
// - Escritorio ancho: índice vertical de secciones a la izquierda del contenido, que acompaña al leer.
// - Pantallas más estrechas: barra «Sección N de M» con un botón por sección, fija bajo la cabecera.
// - Botón «Siguiente Sección ↓» al final de cada .seccion (la última lleva a la parte siguiente de la página).
// El salto usa enlaces #seccion-N; el desplazamiento suave y el ajuste a cada sección están en css/estilos.css.
(function () {
  var secciones = Array.prototype.slice.call(document.querySelectorAll('.seccion'));
  var cabecera = document.querySelector('.marca-hotel');
  if (secciones.length < 2 || !cabecera) return;

  var titulos = secciones.map(function (seccion, i) {
    if (!seccion.id) seccion.id = 'seccion-' + (i + 1);
    var t = seccion.querySelector('.titulo-seccion');
    return t ? t.textContent : '';
  });
  var enlaces = [];   // enlaces de ambos menús; enlaces[k].seccion = índice de la sección
  var rotulos = [];   // textos «Sección N de M» de ambos menús

  function enlace(i, html) {
    var a = document.createElement('a');
    a.href = '#' + secciones[i].id;
    a.innerHTML = html;
    a.seccion = i;
    enlaces.push(a);
    return a;
  }

  // 1a. Índice vertical (escritorio): al lado del bloque <section> que contiene las secciones.
  var bloque = secciones[0].closest('section') || secciones[0].parentNode;
  var indice = document.createElement('nav');
  indice.className = 'indice-secciones no-imprimir';
  indice.setAttribute('aria-label', 'Secciones');
  indice.innerHTML = '<div class="fijo"><span class="donde"></span><ol></ol></div>';
  var ol = indice.querySelector('ol');
  secciones.forEach(function (seccion, i) {
    var li = document.createElement('li');
    li.appendChild(enlace(i, '<span class="n">' + (i + 1) + '</span><span class="t"></span>'));
    li.querySelector('.t').textContent = titulos[i];
    ol.appendChild(li);
  });
  rotulos.push(indice.querySelector('.donde'));
  bloque.classList.add('con-indice');
  bloque.appendChild(indice);

  // 1b. Barra horizontal (pantallas estrechas): dentro de la cabecera, así se queda fija con ella.
  // (un div y no un <nav>: los estilos de «.marca-hotel nav» son para el enlace «Todos los temas»)
  var barra = document.createElement('div');
  barra.className = 'barra-secciones no-imprimir';
  barra.innerHTML = '<div class="contenedor"><span class="donde"></span><div class="puntos" role="navigation" aria-label="Secciones"></div></div>';
  var puntos = barra.querySelector('.puntos');
  secciones.forEach(function (seccion, i) {
    var a = puntos.appendChild(enlace(i, String(i + 1)));
    a.title = 'Sección ' + (i + 1) + (titulos[i] ? ': ' + titulos[i] : '');
  });
  rotulos.push(barra.querySelector('.donde'));
  cabecera.appendChild(barra);

  // 2. Botón «Siguiente Sección» al final de cada sección.
  var despues = bloque.nextElementSibling;
  secciones.forEach(function (seccion, i) {
    var destino = secciones[i + 1], texto = 'Siguiente Sección ↓';
    if (!destino) {
      if (!despues || despues.tagName !== 'SECTION') return;
      if (!despues.id) despues.id = 'despues-de-las-secciones';
      var h2 = despues.querySelector('h2');
      destino = despues;
      texto = 'Ir a ' + (h2 ? '«' + h2.textContent + '»' : 'la siguiente parte') + ' ↓';
    }
    var a = document.createElement('a');
    a.className = 'siguiente-seccion no-imprimir';
    a.href = '#' + destino.id;
    a.textContent = texto;
    (seccion.querySelector('.cuerpo') || seccion).appendChild(a);
  });

  // 3. Altura de la cabecera (cambia al hacerse pequeña): para que los saltos no queden tapados.
  function medir() {
    document.documentElement.style.setProperty('--alto-cabecera', cabecera.offsetHeight + 'px');
  }
  if (window.ResizeObserver) new ResizeObserver(medir).observe(cabecera);

  // 4. Marcar la sección que se está leyendo.
  var actual = null;
  function marcar() {
    var linea = cabecera.offsetHeight + 80, n = -1;
    secciones.forEach(function (seccion, i) {
      if (seccion.getBoundingClientRect().top <= linea) n = i;
    });
    if (n === actual) return;
    actual = n;
    rotulos.forEach(function (r) {
      r.textContent = n < 0 ? secciones.length + ' secciones' : 'Sección ' + (n + 1) + ' de ' + secciones.length;
    });
    enlaces.forEach(function (a) {
      a.classList.toggle('hecho', a.seccion < n);
      a.classList.toggle('actual', a.seccion === n);
      if (a.seccion === n) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    });
  }

  var pendiente = false;
  addEventListener('scroll', function () {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () { pendiente = false; marcar(); });
  }, { passive: true });
  addEventListener('resize', function () { medir(); marcar(); });
  medir();
  marcar();
})();
