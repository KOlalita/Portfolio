/* Los tres botones de macOS. Los glifos solo aparecen al pasar el raton. */
export default function TrafficLights({ onClose, onMinimize, onZoom, zoomed }) {
  return (
    <div className="lights" onMouseDown={(e) => e.stopPropagation()}>
      <button className="light light--close" onClick={onClose} aria-label="Cerrar">
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3.6 3.6l4.8 4.8M8.4 3.6l-4.8 4.8" />
        </svg>
      </button>
      <button className="light light--min" onClick={onMinimize} aria-label="Minimizar">
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3.2 6h5.6" />
        </svg>
      </button>
      <button
        className="light light--zoom"
        onClick={onZoom}
        aria-label={zoomed ? 'Restaurar' : 'Maximizar'}
      >
        <svg viewBox="0 0 12 12" aria-hidden="true" className="zoomglyph">
          <path d="M4 4h4v4z" />
        </svg>
      </button>
    </div>
  )
}
