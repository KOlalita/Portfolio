import { WINDOWS } from '../data/content.jsx'
import { useLang } from '../i18n.jsx'

/*
 * Iconos del escritorio. Un clic abre la ventana: en un escritorio de verdad
 * haria falta doble clic, pero aqui son la via de entrada para quien no va a
 * escribir comandos, y un clic que no hace nada se lee como que esta roto.
 *
 * Cada dibujo es un SVG propio con su pareja de color, para que se distingan
 * de un vistazo sin leer la etiqueta.
 */

const TINTS = {
  aboutme: ['#d9b4f2', '#8a54d0'],
  projects: ['#f9c07a', '#e0822f'],
  cv: ['#8fe4f4', '#3fa8c9'],
  contact: ['#f7a8cf', '#d4559b'],
}

function Glyph({ id, children }) {
  const [light, dark] = TINTS[id] || TINTS.aboutme
  const grad = 'icg-' + id
  return (
    <svg className="icon__art" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>
      <g fill={'url(#' + grad + ')'} stroke="none">
        {children}
      </g>
    </svg>
  )
}

/* Trazos finos sobre el relleno, para el detalle interior. */
const line = { fill: 'none', stroke: 'rgba(12,8,24,0.55)', strokeWidth: 1.5, strokeLinecap: 'round' }

const ART = {
  // Busto: cabeza y hombros.
  aboutme: (
    <Glyph id="aboutme">
      <circle cx="12" cy="8.4" r="3.9" />
      <path d="M4.4 20.4c0-4.1 3.4-6.6 7.6-6.6s7.6 2.5 7.6 6.6a1 1 0 0 1-1 1H5.4a1 1 0 0 1-1-1z" />
    </Glyph>
  ),

  // Carpeta con pestana.
  projects: (
    <Glyph id="projects">
      <path d="M2.6 6.6a2 2 0 0 1 2-2h3.7a1 1 0 0 1 .8.4l1.5 2h8.8a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H4.6a2 2 0 0 1-2-2z" />
      <path d="M3.3 10.4h17.4a1 1 0 0 1 1 1.1l-.7 6.3a2 2 0 0 1-2 1.6H5a2 2 0 0 1-2-1.6l-.7-6.3a1 1 0 0 1 1-1.1z" opacity=".55" />
    </Glyph>
  ),

  // Hoja con esquina doblada y renglones.
  cv: (
    <Glyph id="cv">
      <path d="M6.2 2.6h6.9a1 1 0 0 1 .7.3l5 5a1 1 0 0 1 .3.7v12.1a1.8 1.8 0 0 1-1.8 1.8H6.2a1.8 1.8 0 0 1-1.8-1.8V4.4a1.8 1.8 0 0 1 1.8-1.8z" />
      <path d="M13.3 2.9v4.8a1 1 0 0 0 1 1h4.6" fill="rgba(255,255,255,0.5)" />
      <path d="M7.8 12.6h8.4M7.8 15.8h5.6M7.8 19h6.9" {...line} />
    </Glyph>
  ),

  // Sobre cerrado con la V de la solapa.
  contact: (
    <Glyph id="contact">
      <rect x="2.4" y="5" width="19.2" height="14" rx="2.2" />
      <path d="M3.6 7.2 12 13.4l8.4-6.2" {...line} />
    </Glyph>
  ),
}

export default function DesktopIcons({ items, onOpen }) {
  const { t } = useLang()

  return (
    <div className="icons">
      {items.map((id) => {
        const spec = WINDOWS[id]
        if (!spec) return null
        return (
          <button
            key={id}
            className="icon"
            onClick={() => onOpen(id)}
            aria-label={t('Abrir ', 'Open ') + spec.label}
            title={'open new --' + spec.label}
          >
            <span className="icon__tile">{ART[id] || ART.aboutme}</span>
            <span className="icon__label">{spec.label}</span>
          </button>
        )
      })}
    </div>
  )
}
