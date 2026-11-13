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
- Explica la palabra técnica la primera vez (Tapechart, folio, OTA, sobreventa...). Si se repite, va al glosario.
- Cada paso responde: **qué ves**, **qué haces** y **para qué te sirve en el turno**.
- Avisa de lo que puede confundir (p. ej. pasos que el recorrido salta solo).
- No inventes funciones. Si algo no se vio en la pantalla real, no se afirma.

## Estructura de cada tutorial
1. Cabecera: título, duración, nivel, una frase de "para qué sirve".
2. "Lo que vas a aprender" (3–5 viñetas).
3. Cómo empezar (dónde se abre en FrontDesko).
4. Pasos: número + título + captura real con marcadores numerados + leyenda (`.leyenda`, un punto por marcador) + "En tu turno" (consejo).
5. Diagrama si ayuda (flujo, ciclo, mapa).
6. Glosario de la página, repaso rápido (preguntas con `<details>`), y enlace al siguiente tema.

## Marca e identidad visual
- Empresa: **Hotel Posada del Desierto**. Logotipo: círculo naranja con un cactus recortado en blanco → `img/logo.svg`.
- **Color principal: naranja del logotipo `#EF9A11`** (`--naranja`). Variantes: `--naranja-fuerte` para fondos con texto blanco, `--naranja-texto` para enlaces/texto. Colores de apoyo: carbón, arena, salvia, turquesa, terracota (todos definidos en `:root` de `css/estilos.css`). No añadir colores fuera de esa paleta.
- Los elementos que imitan botones o pestañas de FrontDesko (`.boton-ui`, `.pestana-ui`) se quedan en azul/gris, como en el sistema real, para que se reconozcan.
- **Todas las páginas llevan la misma cabecera de marca** (copiar tal cual de `index.html`):
  `logo | HOTEL POSADA DEL DESIERTO | Capacitación FrontDesko` + enlace «Todos los temas», y el mismo pie con el logo.

## Técnica
- HTML + CSS puros, sin build, sin frameworks y **sin CDN**: debe abrirse con doble clic y funcionar sin internet en cualquier PC de recepción.
- Estilos compartidos en `css/estilos.css`. Reutiliza sus clases (`.paso`, `.captura`, `.marca`, `.nota`, `.flujo`, etc.) en lugar de crear estilos nuevos por página.
- Páginas en la raíz con prefijo de orden: `01-recorrido.html`, `02-leer-el-panel.html`... `index.html` es la portada y lista los temas.
- Imágenes en `img/<tema>/NN-descripcion.jpg`.
- Marcadores sobre capturas: `<span class="marca" style="left:X%;top:Y%" data-n="1"></span>` dentro de `.captura`, con X/Y en porcentaje del tamaño de la imagen (coordenada px ÷ ancho/alto de la captura).
- Debe imprimirse bien (hay estilos `@media print`).

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
- [ ] Leer el Panel
- [ ] Entender el Tapechart
- [ ] Crear una reserva sin cita previa
- [ ] Hacer el check-in de un huésped
- [ ] Hacer el check-out de un huésped
- [ ] Encontrar cualquier reserva rápido
- [ ] Trabajar con la lista de reservas
- [ ] Acciones rápidas con clic derecho
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
