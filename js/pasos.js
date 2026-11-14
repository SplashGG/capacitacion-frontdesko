// Lectura guiada de los pasos.
// - Escritorio ancho: índice vertical de pasos a la izquierda del contenido, que acompaña al leer.
// - Pantallas más estrechas: barra «Paso N de M» con un botón por paso, fija bajo la cabecera.
// - Botón «Siguiente Sección ↓» al final de cada .paso (el último lleva a la sección siguiente).
// El salto usa enlaces #paso-N; el desplazamiento suave y el ajuste a cada paso están en css/estilos.css.
(function () {
  var pasos = Array.prototype.slice.call(document.querySelectorAll('.paso'));
  var cabecera = document.querySelector('.marca-hotel');
  if (pasos.length < 2 || !cabecera) return;

  var titulos = pasos.map(function (paso, i) {
    if (!paso.id) paso.id = 'paso-' + (i + 1);
    var t = paso.querySelector('.titulo-paso');
    return t ? t.textContent : '';
  });
  var enlaces = [];   // enlaces de ambos menús; enlaces[k].paso = índice del paso
  var rotulos = [];   // textos «Paso N de M» de ambos menús

  function enlace(i, html) {
    var a = document.createElement('a');
    a.href = '#' + pasos[i].id;
    a.innerHTML = html;
    a.paso = i;
    enlaces.push(a);
    return a;
  }

  // 1a. Índice vertical (escritorio): al lado de la sección de los pasos.
  var seccion = pasos[0].closest('section') || pasos[0].parentNode;
  var indice = document.createElement('nav');
  indice.className = 'indice-pasos no-imprimir';
  indice.setAttribute('aria-label', 'Pasos');
  indice.innerHTML = '<div class="fijo"><span class="donde"></span><ol></ol></div>';
  var ol = indice.querySelector('ol');
  pasos.forEach(function (paso, i) {
    var li = document.createElement('li');
    li.appendChild(enlace(i, '<span class="n">' + (i + 1) + '</span><span class="t"></span>'));
    li.querySelector('.t').textContent = titulos[i];
    ol.appendChild(li);
  });
  rotulos.push(indice.querySelector('.donde'));
  seccion.classList.add('con-indice');
  seccion.appendChild(indice);

  // 1b. Barra horizontal (pantallas estrechas): dentro de la cabecera, así se queda fija con ella.
  // (un div y no un <nav>: los estilos de «.marca-hotel nav» son para el enlace «Todos los temas»)
  var barra = document.createElement('div');
  barra.className = 'barra-pasos no-imprimir';
  barra.innerHTML = '<div class="contenedor"><span class="donde"></span><div class="puntos" role="navigation" aria-label="Pasos"></div></div>';
  var puntos = barra.querySelector('.puntos');
  pasos.forEach(function (paso, i) {
    var a = puntos.appendChild(enlace(i, String(i + 1)));
    a.title = 'Paso ' + (i + 1) + (titulos[i] ? ': ' + titulos[i] : '');
  });
  rotulos.push(barra.querySelector('.donde'));
  cabecera.appendChild(barra);

  // 2. Botón «Siguiente Sección» al final de cada paso.
  var despues = seccion.nextElementSibling;
  pasos.forEach(function (paso, i) {
    var destino = pasos[i + 1], texto = 'Siguiente Sección ↓';
    if (!destino) {
      if (!despues || despues.tagName !== 'SECTION') return;
      if (!despues.id) despues.id = 'despues-de-los-pasos';
      var h2 = despues.querySelector('h2');
      destino = despues;
      texto = 'Ir a ' + (h2 ? '«' + h2.textContent + '»' : 'la siguiente sección') + ' ↓';
    }
    var a = document.createElement('a');
    a.className = 'siguiente-paso no-imprimir';
    a.href = '#' + destino.id;
    a.textContent = texto;
    (paso.querySelector('.cuerpo') || paso).appendChild(a);
  });

  // 3. Altura de la cabecera (cambia al hacerse pequeña): para que los saltos no queden tapados.
  function medir() {
    document.documentElement.style.setProperty('--alto-cabecera', cabecera.offsetHeight + 'px');
  }
  if (window.ResizeObserver) new ResizeObserver(medir).observe(cabecera);

  // 4. Marcar el paso que se está leyendo.
  var actual = null;
  function marcar() {
    var linea = cabecera.offsetHeight + 80, n = -1;
    pasos.forEach(function (paso, i) {
      if (paso.getBoundingClientRect().top <= linea) n = i;
    });
    if (n === actual) return;
    actual = n;
    rotulos.forEach(function (r) {
      r.textContent = n < 0 ? pasos.length + ' pasos' : 'Paso ' + (n + 1) + ' de ' + pasos.length;
    });
    enlaces.forEach(function (a) {
      a.classList.toggle('hecho', a.paso < n);
      a.classList.toggle('actual', a.paso === n);
      if (a.paso === n) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
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
