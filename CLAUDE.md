# Capacitación FrontDesko — Hotel Posada del Desierto

## Qué es este proyecto
Un **minisitio estático en HTML** para enseñar a recepcionistas y al resto del equipo a usar **FrontDesko**, el nuevo PMS del hotel (https://staydesko.com). Sustituye al sistema anterior, así que cada tutorial debe ser claro para alguien que nunca lo ha usado.

Cada página es un tutorial corto con **capturas reales** de FrontDesko, pasos numerados y explicaciones en lenguaje de recepción.

## Para quién se escribe
- Recepcionistas (principal), supervisores, ama de llaves, auditor nocturno.
- No son técnicos. Pueden estar atendiendo a un huésped mientras leen.

## Reglas de redacción
- Español neutro, trato de **tú**, frases cortas. Una acción por paso.
- Botones y pestañas en **negrita** y con el texto exacto de la pantalla (`**Siguiente**`, `**Reservas**`).
- La tecla Enter se nombra «Enter» (no «Intro») y se dibuja como tecla: `presiona la tecla <kbd class="tecla">Enter</kbd>` (sale con el icono ↵ a la izquierda).
- Escribe siempre **«Tapechart (Calendario de reservas)»**, nunca «Tapechart» solo: es el nombre que usa FrontDesko, pero el equipo no lo conoce.
- Explica la palabra técnica la primera vez (Tapechart, folio, OTA, sobreventa...). Si se repite, va al glosario.
- **Palabras con definición en globo (`.termino`):** si una palabra técnica aparece en el texto sin explicarse ahí mismo (en una leyenda, un consejo, el repaso...) y está en el glosario de la página, márcala con `<span class="termino">ADR</span>`. Al pasar el ratón (o llegar con Tab) sale un globo con su definición del glosario; al hacer clic (o tocarla, o Enter), la página baja a esa palabra en el glosario. No escribas «mira el glosario».
  - La definición se escribe **una sola vez**, en el `<dt>`/`<dd>` de `dl.glosario` de esa página. El texto del `.termino` debe coincidir con el `<dt>` (sin distinguir mayúsculas); si no coincide (plural, otra forma), usa `data-termino`: `<span class="termino" data-termino="OTA">OTA's</span>`.
  - Úsalo en la primera aparición de cada término dentro de un paso, no en todas. No hace falta donde la frase ya lo explica.
  - Puede ir dentro de `<b>` (`<b class="termino">ADR</b>`). Lo gestiona `js/anotaciones.js`; si el término no está en el glosario, se queda como texto normal.
- Cada paso responde: **qué ves**, **qué haces** y **para qué te sirve en el turno**.
- Avisa de lo que puede confundir (p. ej. pasos que el recorrido salta solo).
- No inventes funciones. Si algo no se vio en la pantalla real, no se afirma.

## Estructura de cada tutorial
1. Cabecera: título, nivel, una frase de "para qué sirve". **No pongas fichas de duración** (p. ej. «⏱ 10 minutos de lectura») en ninguna página.
2. "Lo que vas a aprender": 3–5 tarjetas, siempre con este marcado (el estilo ya está en `.aprenderas`: tarjeta con el icono de birrete en un círculo, dos columnas en escritorio y una en móvil). Sin números (no son pasos). Cada tarjeta, una frase corta (idealmente una línea) que dice qué sabrás hacer o encontrar:
   ```html
   <section>
     <h2>Lo que vas a aprender</h2>
     <ul class="aprenderas">
       <li>Dónde ver cómo va el día: ocupación, llegadas y salidas.</li>
       <li>Qué es el <b>Tapechart (Calendario de reservas)</b> y cómo se lee.</li>
     </ul>
   </section>
   ```
3. Cómo empezar (dónde se abre en FrontDesko).
4. Secciones (`<article class="seccion">`, bajo el título «Paso a paso»): número + título (`.titulo-seccion`) + captura real con marcadores numerados + leyenda (`.leyenda`, un punto por marcador) + "En tu turno" (consejo). Los **pasos** son los puntos numerados de la leyenda dentro de cada sección. En el texto, para remitir a otra parte del tema, escribe «sección N» (no «paso N»).
5. Diagrama si ayuda (flujo, ciclo, mapa).
6. Glosario de la página, repaso rápido (preguntas con `<details>`), y al final `nav.temas-vecinos`: botón negro (carbón) `a.tema-anterior` (`<span class="flecha" aria-hidden="true">←</span>Ir al anterior`, al tema anterior) + tarjeta `.tarjeta.siguiente` con el siguiente tema. El primer tema (`01-recorrido.html`) no lleva botón: solo la tarjeta.

## Marca e identidad visual
- Empresa: **Hotel Posada del Desierto**. Logotipo: círculo naranja con un cactus recortado en blanco → `img/logo.svg`.
- **Color principal: naranja del logotipo `#EF9A11`** (`--naranja`). Variantes: `--naranja-fuerte` para fondos con texto blanco, `--naranja-texto` para enlaces/texto. Colores de apoyo: carbón, arena, salvia, turquesa, terracota (todos definidos en `:root` de `css/estilos.css`). No añadir colores fuera de esa paleta.
- **Avisos** (`.nota.ojo`, «Cuidado: …»): amarillo `--amarillo` / `--amarillo-claro`, nunca el naranja de marca, para que no se confundan. El amarillo solo se usa en avisos.
- Los elementos que imitan botones o pestañas de FrontDesko (`.boton-ui`, `.pestana-ui`) se quedan en azul/gris, como en el sistema real, para que se reconozcan. El botón **Check-out** es morado en FrontDesko: usa `.boton-ui.morado`. Los botones de cobro verdes (**Cobrar y hacer check-in**, **Cobrar y hacer check-out**): `.boton-ui.verde`.
- **Todas las páginas llevan la misma cabecera de marca** (copiar tal cual de `index.html`):
  `logo | HOTEL POSADA DEL DESIERTO | Capacitación FrontDesko` + enlace «Todos los temas», y el mismo pie con el logo.
  La cabecera es fija y se hace pequeña al desplazarse (solo CSS, en `css/estilos.css`).

## Técnica
- HTML + CSS puros, sin build, sin frameworks y **sin CDN**: debe abrirse con doble clic y funcionar sin internet en cualquier PC de recepción.
- Estilos compartidos en `css/estilos.css`. Reutiliza sus clases (`.seccion`, `.captura`, `.marca`, `.nota`, `.flujo`, etc.) en lugar de crear estilos nuevos por página.
- Páginas en la raíz con prefijo de orden: `01-recorrido.html`, `02-leer-el-panel.html`... `index.html` es la portada y lista los temas.
- Imágenes en `img/<tema>/NN-descripcion.jpg`.
- Marcadores sobre capturas, dentro de `.captura`, con valores en porcentaje del tamaño de la imagen (px ÷ ancho/alto de la captura). Mismo estilo (borde naranja, latido y número), dos formas:
  - **Caja (lo normal):** enmarca toda la zona que se explica (botón, campo, tarjeta, columna...). `left`/`top` = esquina superior izquierda, con unos px de margen alrededor de la zona:
    `<span class="marca caja" style="left:X%;top:Y%;width:W%;height:H%" data-n="1"></span>`
  - **Círculo:** solo para un punto pequeño o cuando una caja taparía demasiado. `left`/`top` = centro:
    `<span class="marca" style="left:X%;top:Y%" data-n="1"></span>`
- Debe imprimirse bien (hay estilos `@media print`).
- Cada página de tutorial incluye en el `<head>`, en este orden:
  ```html
  <script src="js/anotaciones.js" defer></script>
  <script src="js/visor.js" defer></script>
  <script src="js/secciones.js" defer></script>
  ```
  - `secciones.js`: lectura guiada. En pantallas anchas (≥1350px) añade un índice vertical de secciones a la izquierda del contenido, siempre con sus títulos, que acompaña al leer; en pantallas más estrechas, una barra «Sección N de M» con un botón por sección bajo la cabecera (enlaces `#seccion-N`). Y al final de cada `.seccion` un botón «Siguiente Sección ↓» (la última lleva a la parte siguiente de la página, p. ej. «Repaso rápido»). Al dejar de desplazarte cerca de una sección, la página se ajusta suavemente a su inicio (`scroll-snap` en `css/estilos.css`). Funciona solo con las `.seccion` de la página: no hay que escribir nada a mano.
  - `visor.js`: al hacer clic en una `.captura` se abre un visor a pantalla completa con zoom (rueda, pellizco, clic, botones +/−) que conserva los marcadores.
  - `anotaciones.js`: al pasar el ratón por un marcador sale un globo con su explicación, también dentro del visor. También muestra la definición de las palabras `.termino` (ver «Reglas de redacción»).
- **Anotaciones (marcador + leyenda):** el texto se escribe una sola vez, en la `.leyenda` de la misma `.seccion` (o `section`). El marcador `data-n="2"` muestra el punto de la leyenda cuyo `<span class="n">2</span>` coincide. Por eso cada marcador debe tener su punto en la leyenda con el mismo número, con esta forma:
  ```html
  <span class="marca" style="left:55.2%;top:23.3%" data-n="2"></span>
  ...
  <ul class="leyenda">
    <li><span class="n">2</span><span><b>Título</b>: descripción.</span></li>
  </ul>
  ```

## Cómo se toman las capturas
- **Capturas de la interfaz real, NO del recorrido guiado.** Los recorridos y tareas guiadas del Centro de aprendizaje de FrontDesko se usan solo como **guía**: para saber qué temas, pantallas y botones hay que enseñar y en qué orden. Después se navega a esas pantallas y se captura la interfaz normal, sin las ventanas ni el oscurecido del recorrido.
  - No enseñamos a usar los recorridos guiados de FrontDesko: nuestros tutoriales los toman como ejemplo y los mejoran.
- Si un paso abre un formulario (p. ej. «Reserva rápida»), se puede abrir para capturarlo, pero se cierra con ✕/Cancelar **sin guardar**.
- Con **Claude en Chrome** sobre la sesión ya abierta del usuario en staydesko.com, en una pestaña nueva.
- **Privacidad:** antes de capturar, reemplazar en pantalla los nombres reales de huéspedes por ficticios con un `MutationObserver` en JS (solo cambia lo que se ve en esa pestaña, no los datos). Nunca publicar nombres reales, teléfonos, emails ni la lista negra.
- Antes de cada captura: mover el ratón a una esquina y quitar el foco (`document.activeElement.blur()`) para que no salgan tooltips.
- Guardar a escala completa (`save_to_disk: true`, sin `scale`), y copiar a `img/<tema>/` con nombre claro.
- **No crear, modificar ni borrar datos reales** del hotel para conseguir una captura. Los recorridos guiados de FrontDesko no cambian datos; las tareas prácticas (crear reserva, check-in, cobros...) sí: preguntar al usuario antes y usar datos de prueba.

## Hoja de ruta (temas del Centro de aprendizaje de FrontDesko)
Marcar con [x] al publicar la página.

**Empieza aquí**
- [x] Recorrido: qué hace FrontDesko → `01-recorrido.html`

**Recepción: lo básico**
- [x] Leer el Panel → `02-leer-el-panel.html`
- [x] Entender el Tapechart → `03-entender-el-tapechart.html`
- [x] Crear una reserva sin cita previa → `04-reserva-sin-cita.html`
- [x] Hacer el check-in de un huésped → `05-check-in.html`
- [x] Hacer el check-out de un huésped → `06-check-out.html`
- [x] Encontrar cualquier reserva rápido → `07-buscar-reserva.html`
- [x] Trabajar con la lista de reservas → `08-lista-reservas.html`
- [x] Acciones rápidas con clic derecho → `09-clic-derecho.html`
- [ ] Atender las solicitudes de los huéspedes
- [ ] Preguntar al asistente de IA

**Gestión de reservas**
- [ ] Cambiar fechas / alargar una estancia
- [ ] Cambiar a un huésped de habitación
- [ ] Cancelar una reserva
- [ ] Marcar un no presentado
- [ ] Crear una reserva de grupo
- [ ] Enviar una confirmación de reserva
- [ ] Imprimir una tarjeta de registro
- [ ] Dejar notas en una reserva
- [ ] Escribir al huésped
- [ ] Bandeja unificada de mensajes

**Huéspedes**
- [ ] Consultar el perfil de un huésped
- [ ] Fusionar huéspedes duplicados

**Facturación y pagos**
- [ ] Cobrar un pago
- [ ] Añadir un cargo a un folio
- [ ] Reembolsar un pago
- [ ] Generar una factura
- [ ] Cuentas por cobrar (facturación a empresas)

**Habitaciones y limpieza**
- [ ] Usar el tablero de limpieza
- [ ] Marcar una habitación como limpia
- [ ] Comunicar una incidencia de mantenimiento
- [ ] Bloquear una habitación

**Tarifas y disponibilidad**
- [ ] Actualizar tus tarifas
- [ ] Poner restricciones de estancia
- [ ] Entender los planes de tarifa
- [ ] Controlar la disponibilidad en las OTA

**Informes y cierre del día**
- [ ] Revisar el resumen diario
- [ ] Sacar y exportar un informe

**Configuración y ajustes personales**
- [ ] Ajustar el tamaño del texto y el contraste
- [ ] Encontrar la configuración del hotel
- [ ] Editar plantillas de documentos
