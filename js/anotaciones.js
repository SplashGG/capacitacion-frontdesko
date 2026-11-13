// Anotaciones de las capturas.
// Al pasar el ratón por un marcador (.marca data-n="N") se muestra un globo con el texto
// del punto N de la .leyenda del mismo paso. El texto se escribe una sola vez, en la leyenda.
// Funciona en la página y dentro del visor (js/visor.js), porque el texto viaja en data-texto.
(function () {
  // 1. Copiar a cada marcador el texto de su punto de la leyenda.
  document.querySelectorAll('.captura').forEach(function (figura) {
    var bloque = figura.closest('.paso, section');
    var leyenda = bloque && bloque.querySelector('.leyenda');
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

  function mostrar(m) {
    globo.innerHTML = '<span class="n">' + m.dataset.n + '</span><span>' + m.dataset.texto + '</span>';
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
    var m = e.target.closest('.marca[data-texto]');
    if (m) mostrar(m);
  });
  document.addEventListener('pointerout', function (e) {
    if (e.target.closest('.marca')) ocultar();
  });
  addEventListener('scroll', ocultar, true);
  addEventListener('wheel', ocultar, { passive: true });
  addEventListener('pointerdown', ocultar);
})();
