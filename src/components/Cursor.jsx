import { useEffect, useRef } from 'react'

/*
 * Puntero propio, con retardo.
 *
 * El cursor del sistema no se puede retrasar: lo pinta el compositor, no la
 * pagina. Asi que se oculta el real y se dibuja uno nuestro que persigue al
 * raton interpolando su posicion en cada fotograma.
 *
 * El tipo sale de la propiedad CSS `--cursor`, heredable, asi que el reparto
 * (quien lleva mano, quien I-beam, quien flecha) vive en la hoja de estilos y
 * aqui no hay que duplicar ninguna lista de selectores.
 *
 * Nada de esto se monta sin raton fino o con `prefers-reduced-motion`: ahi se
 * queda el cursor nativo, que es lo que esa gente espera.
 */

/* Cuanto se acerca al raton en cada fotograma. Mas bajo = mas retardo. */
const EASE = 0.19

const TYPES = ['arrow', 'hand', 'text', 'wait', 'ns', 'ew', 'nwse', 'nesw']

export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || still.matches) return undefined

    const node = ref.current
    if (!node) return undefined

    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    let placed = false
    let type = 'arrow'
    let lastTarget = null
    let raf = 0

    const draw = () => {
      raf = 0
      /*
       * El puntero real no se esconde hasta que este bucle ha corrido una vez.
       * Si requestAnimationFrame no llegara a dispararse (una pestana en
       * segundo plano que nunca se pinta, por ejemplo), lo peor que pasa es
       * que se vea el cursor del sistema, y no que no se vea ninguno.
       */
      document.body.classList.add('has-cursor')
      x += (tx - x) * EASE
      y += (ty - y) * EASE
      node.style.setProperty('--x', x)
      node.style.setProperty('--y', y)
      // Deja de pedir fotogramas cuando ya ha alcanzado al raton.
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(draw)
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    const move = (e) => {
      tx = e.clientX
      ty = e.clientY

      if (!placed) {
        // La primera vez aparece donde esta el raton, sin barrido desde 0,0.
        placed = true
        x = tx
        y = ty
        node.classList.add('is-on')
      }

      // El tipo solo se recalcula al cambiar de elemento, no en cada pixel.
      if (e.target !== lastTarget) {
        lastTarget = e.target
        // getComputedStyle revienta si el objetivo no es un elemento.
        const want =
          e.target instanceof Element
            ? getComputedStyle(e.target).getPropertyValue('--cursor').trim()
            : ''
        const next = TYPES.includes(want) ? want : 'arrow'
        if (next !== type) {
          node.classList.remove('cur--' + type)
          node.classList.add('cur--' + next)
          type = next
        }
      }

      wake()
    }

    const leave = () => node.classList.remove('is-on')
    const enter = () => node.classList.add('is-on')

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    return () => {
      document.body.classList.remove('has-cursor')
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', move)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
    }
  }, [])

  return <div className="cursor cur--arrow" ref={ref} aria-hidden="true" />
}
