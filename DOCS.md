# Portfolio — Terminal

Portfolio estático en React + Vite con forma de terminal de macOS. La terminal
es la interfaz: los comandos abren ventanas flotantes, arrastrables y
superpuestas que contienen el contenido real.

## Arrancar

```bash
npm install
npm run dev
```

`npm run build` genera `dist/` listo para cualquier hosting estático
(Vercel, Netlify, GitHub Pages — `base` ya está en `./`).

## Comandos de la terminal

| Comando | Qué hace |
| --- | --- |
| `help` | Guía de comandos (alias: `/help`, `?`, `man`, `ayuda`) |
| `open new --<ventana>` | Abre una ventana flotante |
| `open --<ventana>` / `open <ventana>` | Forma corta |
| `ls` | Lista las ventanas disponibles |
| `ls --open` | Lista las ventanas abiertas ahora |
| `close --<ventana>` | Cierra una ventana |
| `close --all` | Cierra todas |
| `minimize --all` | Minimiza todas al dock |
| `whoami` | Resumen del perfil |
| `banner` | Reimprime la ficha de bienvenida |
| `lang es` / `lang en` | Cambia el idioma (igual que el interruptor) |
| `github` | Abre github.com/KOlalita |
| `linkedin` | Abre mi perfil de LinkedIn |
| `cv`, `contact`, `projects`, `skills`, `about` | Atajos directos |
| `neofetch` | Ficha del sistema |
| `clear` | Limpia la terminal y reimprime la ficha (alias `cls`, o `Ctrl/Cmd+L`) |

Ventanas: `AboutMe`, `Skills`, `Tech`, `Projects`, `Cutzen`, `RemaFeed`, `CV`,
`CV.pdf`, `Contact`.

Atajos de edición: `Tab` autocompleta comandos y nombres de ventana, `↑`/`↓`
recorren el historial.

## Estructura

```
src/
  App.jsx                  gestor de ventanas (orden z, minimizar, dock)
  components/
    BootScreen.jsx         animación de arranque
    Terminal.jsx           terminal: historial, prompt, render de salida
    Welcome.jsx            ficha de bienvenida tipo neofetch (foto + datos)
    LangSwitch.jsx         interruptor ES/EN de la barra de la terminal
    DesktopIcons.jsx       iconos del escritorio
    Window.jsx             ventana flotante arrastrable y redimensionable
    Dock.jsx               task bar con previews en vivo
    TrafficLights.jsx      botones rojo/amarillo/verde
  data/
    content.jsx            CONTENIDO: perfil, ventanas y alias
    commands.js            registro de comandos y autocompletado
  i18n.jsx                 contexto de idioma, persistencia y helper t()
  styles.css               todo el estilo (sin framework CSS)
```

## Idioma

El interruptor ES/EN vive en el margen superior derecho de la barra de la
terminal. La elección se guarda en `localStorage`; en la primera visita se
toma del idioma del navegador. También existe el comando `lang es` / `lang en`.

Al cambiar de idioma la terminal se reinicia (igual que un shell nuevo) para no
mezclar salida vieja en el otro idioma; las ventanas abiertas se mantienen y
traducen su contenido en el sitio.

Para traducir texto nuevo se usa `t(es, en)`: en componentes viene de
`useLang()`, en los `body` de las ventanas llega como prop, y en `commands.js`
se construye con `translator(lang)`. Ambos idiomas quedan juntos en el mismo
punto del código, así que no hay archivos de traducción que mantener en
paralelo.

## Fondo de pantalla

`public/wallpaper.svg` — una flor abstracta de pétalos translúcidos al estilo
del fondo de Windows 11, en la paleta del sitio. Es SVG, así que pesa 3 KB y
escala a cualquier resolución sin pixelarse.

Lo aplica `App.jsx` como `background-image` del `.desktop`, construyendo la
ruta con `import.meta.env.BASE_URL` para que funcione también bajo un subpath.
Se encuadra con `background-size: cover`.

La marca `KolalitaOS` **no** está dentro del SVG: es un elemento del DOM
(`.desktop__mark`) en la esquina inferior derecha. Incrustada en la imagen se
escalaría con el fondo y a pantalla completa saldría enorme; en el DOM mantiene
sus 13 px a cualquier resolución y nunca la recorta el encuadre. En pantallas
estrechas sube arriba a la derecha, donde no la tapa la task bar.

Para cambiar el fondo basta con sustituir el SVG. El `.desktop__glow`, un velo
de luz que deriva despacio por encima, sigue ahí a muy baja opacidad.

## Punteros

Pixel art retro: negro con contorno blanco de 1 px, ampliado x1.4 (constante
`SCALE` del script) para que se vean los píxeles sin que el puntero resulte
grande. Ocho sprites — flecha, mano, reloj de arena, I-beam y los
cuatro de redimensionado. El reloj sale durante el arranque.

Se generan con un script a partir de rejillas de caracteres (`#` negro,
`o` blanco, `.` transparente); el contorno blanco lo calcula el script solo:

```bash
npm run cursors:gen
```

Escribe `src/cursors.css`, que **no se edita a mano**. Para retocar un puntero
se cambia su rejilla en `scripts/gen-cursors.py` y se vuelve a generar.

### El retardo

El cursor del sistema no se puede retrasar: lo pinta el compositor, no la
página. Así que `Cursor.jsx` oculta el real y dibuja uno propio que persigue al
ratón interpolando su posición cada fotograma. La constante `EASE` controla
cuánto se acerca por fotograma: más baja, más retardo.

El tipo sale de la propiedad CSS `--cursor`, que es heredable, así que el
reparto (quién lleva mano, quién I-beam) vive en `styles.css` y el componente
no duplica ninguna lista de selectores. Sólo se recalcula al cambiar de
elemento, no en cada píxel, y el bucle se detiene cuando alcanza al ratón.

El puntero real no se esconde hasta que el bucle ha corrido una vez: si
`requestAnimationFrame` no llegara a dispararse, lo peor que pasa es que se vea
el cursor del sistema, no que no se vea ninguno. Sin ratón fino o con
`prefers-reduced-motion` no se monta nada y queda el cursor nativo.

## Iconos del escritorio

Columna arriba a la izquierda con `AboutMe`, `Projects`, `CV` y `Contact`, para
quien no vaya a escribir comandos. Un clic abre la ventana: en un escritorio de
verdad haría falta doble clic, pero aquí son la vía de entrada principal y un
clic que no hace nada se lee como que la página está rota. Son `<button>`, así
que funcionan con Tab y Enter.

Cada dibujo es un SVG propio dentro de `DesktopIcons.jsx` (busto, carpeta, hoja
con la esquina doblada, sobre) con su pareja de color en la constante `TINTS`,
para que se distingan de un vistazo sin leer la etiqueta. Los glifos de texto
tipo `[ ~ ]` siguen en la task bar y en las vistas previas.

Para cambiar qué iconos salen, edita el array que `App.jsx` pasa a
`DesktopIcons`; cada id tiene que existir en `WINDOWS` y tener su entrada en
`ART` y `TINTS`.

La terminal se centra en el espacio a la derecha de la columna (`left: 112px`
en `.term`) para no taparlos al arrancar. En pantallas grandes eso la desvía
unos 56 px del centro real, que no se nota; a cambio los iconos se ven siempre.
En móvil los iconos pasan a una fila bajo la barra de menús y la terminal se
ancla entre esa fila y la task bar.

## Ventanas

Se arrastran por la barra de título y se redimensionan por cualquiera de sus
ocho asideros: cuatro bordes y cuatro esquinas. Al tirar del borde izquierdo o
del superior la ventana crece hacia ese lado, con un mínimo de 300x200. El
contenido se reajusta solo, porque el cuerpo es un flex con scroll propio.

La terminal es la excepción: no se redimensiona, sólo se maximiza con el botón
verde o con doble clic en su barra.

### Animaciones

Tres curvas, definidas como variables en `styles.css`:

- `--ease-glide` — decelera largo y suave, la curva de las hojas de iOS. Anima
  la geometría al maximizar y restaurar.
- `--ease-settle` — rebasa un poco y vuelve. La ventana se levanta al agarrarla
  (escala y sombra) y se posa al soltarla.
- `--ease-pop` — el rebote del cierre: la ventana toma impulso hacia fuera
  antes de irse.

Mientras se arrastra o se redimensiona, las transiciones de `left/top/width/
height` se apagan (clases `win--move` y `win--resize`): con ellas activas la
ventana perseguiría al cursor con retardo.

La terminal se centra con `inset: 0` + `margin: auto` en vez de con
`transform: translate(-50%, -50%)`. Así el `transform` queda libre para el
rebote y el minimizado, y el ancho y el alto pueden animarse al maximizar sin
pelearse con el centrado.

El bloque `prefers-reduced-motion` al final de la hoja desactiva todo esto.

## Ventana del PDF

`open new --CV.pdf` (o el botón "Ver el PDF" de la ventana CV) abre el
currículum como una ventana más. No es un iframe: son las páginas del PDF
rasterizadas a WebP, así que se ven igual en todos los navegadores, incluido
Safari en iOS, y se adaptan al ancho de la ventana al redimensionarla. El PDF
original sigue descargable desde la propia ventana.

**Al cambiar el PDF hay que regenerar las imágenes:**

```bash
npm run cv:render
```

Necesita `python -m pip install pymupdf pillow`. El script imprime las rutas
generadas; si el número de páginas cambia, hay que reflejarlo en
`PROFILE.cvPages` dentro de `content.jsx`.

## Task bar

Lista todas las ventanas vivas, incluida la terminal. Al pasar el ratón sobre
un botón aparece una vista previa: no es una captura, es el mismo componente de
contenido reescalado, así que siempre refleja el estado real. Desde la vista
previa se puede cerrar la ventana con la `×`.

Clic en un botón: restaura si está minimizada, la trae al frente si está
detrás, y la minimiza si ya estaba enfocada.

## Cómo iterar

- **Editar textos**: sólo `src/data/content.jsx`. Cada entrada de `WINDOWS`
  define `title` (barra de la ventana), `label` (lo que se escribe tras `--`),
  `size` y un `body` que es un componente React.
- **Añadir una ventana**: agrega una clave nueva a `WINDOWS`. Queda disponible
  automáticamente en `open new --<Label>`, en `ls`, en `help` y en el
  autocompletado. Opcionalmente añade alias en `WINDOW_ALIASES`.
- **Añadir un comando**: agrega una entrada al objeto `commands` de
  `src/data/commands.js` y una línea a `HELP_LINES`.
- **Datos personales y enlaces**: constante `PROFILE` en `content.jsx`
  (el CV apunta a `#` hasta que haya un PDF en `public/`).

### Pendientes de contenido real

- **Foto**: `PROFILE.avatar` apunta a un gatito de `placecats.com`. Sustituir
  por una foto propia en `public/` (por ejemplo `'/avatar.jpg'`); si la imagen
  falla, `Welcome.jsx` cae en un avatar SVG local.
- **Repositorios**: la constante `REPOS` de `content.jsx` apunta ya a
  `github.com/KOlalita/CutZen` y `github.com/KOlalita/RemaFeed`. Pon `null` si
  alguno vuelve a ser privado y el botón se sustituye por una nota.
- **Datos del PDF**: el CV incluye domicilio completo y teléfono, y ahora se
  ve dentro del sitio además de descargarse. Si no quieres publicarlos, hay que
  generar una versión del PDF sin esos campos y volver a correr `cv:render`.

El resto del contenido sale del CV y de los dos proyectos.
