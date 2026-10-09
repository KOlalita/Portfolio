import { useRef, useState } from 'react'
import { useLang } from '../i18n.jsx'

const PREVIEW_SCALE = 0.36

/*
 * Task bar. Lista todas las ventanas vivas (incluida la terminal) y muestra
 * una miniatura real al pasar el raton: el mismo componente de contenido
 * reescalado, con su propio cromo de ventana.
 */
export default function Dock({ items, onActivate, onClose }) {
  const { t } = useLang()
  const [hover, setHover] = useState(null)
  const timer = useRef(null)

  const enter = (key) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setHover(key), 160)
  }

  const leave = () => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setHover(null), 90)
  }

  if (!items.length) return null

  return (
    <div className="taskbar" onMouseLeave={leave}>
      {items.map((item) => (
        <div
          className={
            'task' +
            (item.active ? ' task--active' : '') +
            (item.minimized ? ' task--minimized' : '')
          }
          key={item.key}
          onMouseEnter={() => enter(item.key)}
          onMouseLeave={leave}
        >
          {hover === item.key && (
            <div className="peek" onMouseEnter={() => enter(item.key)}>
              <div className="peek__chrome">
                <span className="peek__lights" aria-hidden="true">
                  <i /><i /><i />
                </span>
                <span className="peek__title">{item.title}</span>
                {onClose && item.closable && (
                  <button
                    className="peek__close"
                    aria-label={t('Cerrar ', 'Close ') + item.label}
                    onClick={(e) => {
                      e.stopPropagation()
                      setHover(null)
                      onClose(item.key)
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="peek__screen">
                {item.preview ? (
                  <div
                    className="peek__scale"
                    style={{
                      width: 100 / PREVIEW_SCALE + '%',
                      height: 100 / PREVIEW_SCALE + '%',
                      transform: 'scale(' + PREVIEW_SCALE + ')',
                    }}
                  >
                    {item.preview}
                  </div>
                ) : (
                  <div className="peek__empty">{t('sin vista previa', 'no preview')}</div>
                )}
              </div>
              <div className="peek__foot">
                {item.minimized
                  ? t('minimizada — clic para restaurar', 'minimized — click to restore')
                  : t('clic para enfocar', 'click to focus')}
              </div>
            </div>
          )}

          <button
            className="task__btn"
            title={item.label}
            onClick={() => onActivate(item.key)}
          >
            <span className="task__icon">{item.icon}</span>
            <span className="task__label">{item.label}</span>
          </button>
          <span className="task__dot" aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}
