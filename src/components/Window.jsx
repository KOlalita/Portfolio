import { useCallback, useEffect, useRef, useState } from 'react'
import TrafficLights from './TrafficLights.jsx'

const MIN_W = 300
const MIN_H = 200

/* Debe coincidir con la duracion de `win-out` en styles.css. */
const CLOSE_MS = 280

/* Los ocho asideros: cuatro bordes y cuatro esquinas. */
const HANDLES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

/*
 * Ventana flotante arrastrable y redimensionable. Controla su posicion y su
 * tamano en estado local; el padre solo decide si existe, si esta minimizada
 * y su z-index. El contenido se reajusta solo: el cuerpo es un flex con scroll.
 */
export default function Window({
  spec,
  z,
  minimized,
  initial,
  onClose,
  onMinimize,
  onFocus,
  children,
}) {
  const [pos, setPos] = useState(initial)
  const [size, setSize] = useState(spec.size)
  const [zoomed, setZoomed] = useState(false)
  const [closing, setClosing] = useState(false)
  /*
   * El gesto vive en un ref para no re-renderizar en cada mousemove, y a la vez
   * en estado para que el CSS pueda apagar las transiciones mientras dura: una
   * transicion sobre left/top haria que la ventana persiguiera al cursor.
   */
  const [mode, setMode] = useState(null)
  const gesture = useRef(null)
  const preZoom = useRef(null)

  const point = (e) => (e.touches ? e.touches[0] : e)

  const startMove = useCallback(
    (e) => {
      if (zoomed) return
      onFocus()
      const p = point(e)
      gesture.current = { mode: 'move', dx: p.clientX - pos.x, dy: p.clientY - pos.y }
      setMode('move')
      document.body.classList.add('is-dragging')
    },
    [pos.x, pos.y, zoomed, onFocus]
  )

  const startResize = useCallback(
    (e, dir) => {
      if (zoomed) return
      e.stopPropagation()
      onFocus()
      const p = point(e)
      gesture.current = {
        mode: 'resize',
        dir,
        startX: p.clientX,
        startY: p.clientY,
        startPos: pos,
        startSize: size,
      }
      setMode('resize')
      document.body.classList.add('is-resizing')
    },
    [pos, size, zoomed, onFocus]
  )

  useEffect(() => {
    const move = (e) => {
      const g = gesture.current
      if (!g) return
      const p = point(e)

      if (g.mode === 'move') {
        // Deja siempre un trozo de barra alcanzable dentro de la pantalla.
        setPos({
          x: Math.min(Math.max(p.clientX - g.dx, -size.w + 120), window.innerWidth - 120),
          y: Math.min(Math.max(p.clientY - g.dy, 8), window.innerHeight - 60),
        })
        return
      }

      const dx = p.clientX - g.startX
      const dy = p.clientY - g.startY
      let { x, y } = g.startPos
      let { w, h } = g.startSize

      if (g.dir.includes('e')) w = g.startSize.w + dx
      if (g.dir.includes('s')) h = g.startSize.h + dy
      if (g.dir.includes('w')) {
        w = g.startSize.w - dx
        x = g.startPos.x + dx
      }
      if (g.dir.includes('n')) {
        h = g.startSize.h - dy
        y = g.startPos.y + dy
      }

      // Al topar con el minimo, el borde opuesto deja de moverse.
      if (w < MIN_W) {
        if (g.dir.includes('w')) x = g.startPos.x + (g.startSize.w - MIN_W)
        w = MIN_W
      }
      if (h < MIN_H) {
        if (g.dir.includes('n')) y = g.startPos.y + (g.startSize.h - MIN_H)
        h = MIN_H
      }

      setSize({ w, h })
      setPos({ x, y })
    }

    const up = () => {
      if (!gesture.current) return
      gesture.current = null
      setMode(null)
      document.body.classList.remove('is-dragging', 'is-resizing')
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [size.w])

  const toggleZoom = () => {
    if (!zoomed) preZoom.current = pos
    else if (preZoom.current) setPos(preZoom.current)
    setZoomed((v) => !v)
    onFocus()
  }

  // Deja correr el rebote de cierre antes de desmontar.
  const requestClose = () => {
    setClosing(true)
    window.setTimeout(onClose, CLOSE_MS)
  }

  const style = zoomed
    ? { left: 24, top: 44, width: 'calc(100vw - 48px)', height: 'calc(100vh - 82px)', zIndex: z }
    : { left: pos.x, top: pos.y, width: size.w, height: size.h, zIndex: z }

  return (
    <section
      className={
        'win' +
        (minimized ? ' win--minimized' : '') +
        (zoomed ? ' win--zoomed' : '') +
        (closing ? ' win--closing' : '') +
        (mode ? ' win--' + mode : '')
      }
      style={style}
      onMouseDown={onFocus}
      aria-hidden={minimized}
    >
      <header
        className="win__bar"
        onMouseDown={startMove}
        onTouchStart={startMove}
        onDoubleClick={toggleZoom}
      >
        <TrafficLights
          onClose={requestClose}
          onMinimize={onMinimize}
          onZoom={toggleZoom}
          zoomed={zoomed}
        />
        <span className="win__title">{spec.title}</span>
      </header>

      <div className={'win__body' + (spec.bare ? ' win__body--bare' : '')}>{children}</div>

      {!zoomed &&
        HANDLES.map((dir) => (
          <span
            key={dir}
            className={'rsz rsz--' + dir}
            onMouseDown={(e) => startResize(e, dir)}
            onTouchStart={(e) => startResize(e, dir)}
          />
        ))}
    </section>
  )
}
