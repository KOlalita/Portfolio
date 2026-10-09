import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n.jsx'

/*
 * Arranque estilo Linux: primero el volcado del kernel, luego las unidades de
 * systemd con sus [  OK  ], y al final el login y el shell. Los mensajes van
 * en ingles a proposito: un log de arranque real no se traduce.
 *
 * `d` es la pausa en ms ANTES de imprimir la linea. Los valores bajos agrupan
 * lineas en rafagas, que es como se ve un arranque de verdad.
 */
const SEQUENCE = [
  { d: 120, text: 'Linux version 6.9.0-kolalita (kolalita@KolalitaOS) #1 SMP PREEMPT_DYNAMIC', ts: 0 },
  { d: 40, text: 'Command line: BOOT_IMAGE=/boot/vmlinuz root=/dev/kolalita ro quiet', ts: 0 },
  { d: 70, text: 'BIOS-provided physical RAM map', ts: 0.013204 },
  { d: 35, text: 'Memory: 16384MB / 16384MB available', ts: 0.021877 },
  { d: 45, text: 'CPU: 8-core @ 3.40GHz  microcode 0xf4', ts: 0.03491 },
  { d: 35, text: 'ACPI: Core revision 20240827', ts: 0.052183 },
  { d: 90, text: 'clocksource: tsc: mask 0xffffffffffffffff', ts: 0.088406 },
  { d: 130, text: 'EXT4-fs (sda1): mounted filesystem /dev/kolalita, ordered data mode', ts: 0.140522 },
  { d: 60, text: 'systemd[1]: Detected architecture x86-64', ts: 0.186331 },

  { d: 220, text: '', plain: true },
  { d: 0, text: 'Welcome to KolalitaOS 1.0.0', cls: 'head', plain: true },
  { d: 180, text: '', plain: true },

  { d: 0, tag: 'OK', text: 'Reached target Local File Systems' },
  { d: 95, tag: 'OK', text: 'Mounted KolalitaOS root filesystem' },
  { d: 80, tag: 'OK', text: 'Loaded KolalitaOS kernel modules' },
  { d: 45, tag: 'OK', text: 'Initialized Linux kernel subsystems' },
  { d: 130, tag: 'OK', text: 'Started KolalitaOS system services' },
  { d: 70, tag: 'OK', text: 'Started KolalitaOS session manager' },
  { d: 60, tag: 'OK', text: 'Configured Linux system locale' },
  { d: 150, tag: 'OK', text: 'Reached KolalitaOS graphical target' },

  { d: 260, text: '', plain: true },
  { d: 0, text: 'KolalitaOS 1.0.0 tty1', cls: 'dim', plain: true },
  { d: 160, text: 'KolalitaOS login: kolalita (autologin)', plain: true },
  { d: 90, text: '', plain: true, login: true },
  { d: 220, text: 'Starting KolalitaOS shell ...', cls: 'head', plain: true },
]

const BOOT_DURATION_SCALE = 0.6

function stamp(ts) {
  return '[' + ts.toFixed(6).padStart(12, ' ') + '] '
}

export default function BootScreen({ onDone }) {
  const { t } = useLang()
  const [shown, setShown] = useState([])
  const [leaving, setLeaving] = useState(false)
  const finished = useRef(false)
  const logRef = useRef(null)

  const finish = () => {
    if (finished.current) return
    finished.current = true
    setLeaving(true)
    window.setTimeout(onDone, 620 * BOOT_DURATION_SCALE)
  }

  useEffect(() => {
    const timers = []
    let acc = 240 * BOOT_DURATION_SCALE

    SEQUENCE.forEach((line, i) => {
      acc += line.d * BOOT_DURATION_SCALE
      timers.push(window.setTimeout(() => setShown((s) => [...s, i]), acc))
    })
    timers.push(window.setTimeout(finish, acc + 520 * BOOT_DURATION_SCALE))

    const skip = (e) => {
      if (e.type === 'click' || e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') finish()
    }
    window.addEventListener('keydown', skip)
    window.addEventListener('click', skip)
    return () => {
      timers.forEach(window.clearTimeout)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('click', skip)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // La consola sigue a la ultima linea, como una tty de verdad.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [shown])

  const lastLogin = new Date().toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={'boot' + (leaving ? ' boot--leaving' : '')}>
      <div className="boot__log" ref={logRef}>
        {shown.map((i) => {
          const l = SEQUENCE[i]
          if (l.login) {
            return (
              <div className="boot__line dim" key={i}>
                {'Last login: ' + lastLogin + ' on tty1'}
              </div>
            )
          }
          return (
            <div className={'boot__line ' + (l.cls || '')} key={i}>
              {l.tag && (
                <>
                  <span className="boot__tag">[&nbsp;&nbsp;{l.tag}&nbsp;&nbsp;]</span>{' '}
                </>
              )}
              {!l.plain && !l.tag && <span className="boot__ts">{stamp(l.ts)}</span>}
              {l.text || ' '}
            </div>
          )
        })}
        {!leaving && <span className="boot__cursor" />}
      </div>

      <div className="boot__hint">
        {t('pulsa cualquier tecla para saltar', 'press any key to skip')}
      </div>
    </div>
  )
}
