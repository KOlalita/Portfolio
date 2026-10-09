import { useCallback, useMemo, useState } from 'react'
import BootScreen from './components/BootScreen.jsx'
import DesktopIcons from './components/DesktopIcons.jsx'
import Cursor from './components/Cursor.jsx'
import Dock from './components/Dock.jsx'
import Terminal from './components/Terminal.jsx'
import Welcome from './components/Welcome.jsx'
import Window from './components/Window.jsx'
import { WINDOWS } from './data/content.jsx'
import { useLang } from './i18n.jsx'

const TERM_KEY = '__terminal__'

/* Cascada de posiciones para que las ventanas no se apilen exactamente igual. */
function spawnPoint(index, spec) {
  const baseX = Math.max(24, window.innerWidth / 2 - spec.size.w / 2 - 140)
  const baseY = Math.max(44, window.innerHeight / 2 - spec.size.h / 2 - 60) // 44 deja libre la barra de menus
  return { x: baseX + index * 32, y: baseY + index * 28 }
}

export default function App() {
  const { lang, setLang, t } = useLang()
  const [booted, setBooted] = useState(false)
  const [open, setOpen] = useState([]) // [{ id, pos }] en orden de apertura
  const [minimized, setMinimized] = useState([])
  const [stack, setStack] = useState([TERM_KEY]) // ultimo = al frente
  const [termClosed, setTermClosed] = useState(false)
  const [spawnCount, setSpawnCount] = useState(0)

  const focus = useCallback((key) => {
    setStack((s) => [...s.filter((k) => k !== key), key])
  }, [])

  const openWindow = useCallback(
    (id) => {
      if (!WINDOWS[id]) return
      setMinimized((m) => m.filter((k) => k !== id))
      setOpen((list) => {
        if (list.some((w) => w.id === id)) return list
        const pos = spawnPoint(spawnCount % 6, WINDOWS[id])
        setSpawnCount((c) => c + 1)
        return [...list, { id, pos }]
      })
      focus(id)
    },
    [focus, spawnCount]
  )

  const closeWindow = useCallback((id) => {
    setOpen((list) => list.filter((w) => w.id !== id))
    setMinimized((m) => m.filter((k) => k !== id))
    setStack((s) => s.filter((k) => k !== id))
  }, [])

  const ctx = useMemo(
    () => ({
      open: openWindow,
      close: closeWindow,
      closeAll: () => {
        setOpen([])
        setMinimized([])
        setStack([TERM_KEY])
      },
      minimizeAll: () => setMinimized(() => open.map((w) => w.id)),
      list: () => open.map((w) => w.id),
      termZ: 100 + Math.max(0, stack.indexOf(TERM_KEY)),
      lang,
      setLang,
    }),
    [openWindow, closeWindow, open, stack, lang, setLang]
  )

  if (!booted) {
    return (
      <>
        <BootScreen onDone={() => setBooted(true)} />
        <Cursor />
      </>
    )
  }

  const top = stack[stack.length - 1]

  /* La task bar lista siempre todo lo que esta vivo, minimizado o no. */
  const dockItems = [
    {
      key: TERM_KEY,
      label: 'zsh',
      title: 'adriano@portfolio — zsh',
      icon: '>_',
      closable: true,
      minimized: termClosed || minimized.includes(TERM_KEY),
      active: !termClosed && !minimized.includes(TERM_KEY) && top === TERM_KEY,
      preview: (
        <div className="peek__term">
          <Welcome />
        </div>
      ),
    },
    ...open.map(({ id }) => {
      const spec = WINDOWS[id]
      const Body = spec.body
      return {
        key: id,
        label: spec.label,
        title: spec.title,
        icon: spec.icon,
        closable: true,
        minimized: minimized.includes(id),
        active: !minimized.includes(id) && top === id,
        preview: (
          <div className="peek__doc">
            <Body open={() => {}} t={t} />
          </div>
        ),
      }
    }),
  ]

  /* Clic en la task bar: restaura si esta oculta, minimiza si ya esta al frente. */
  const activate = (key) => {
    const isHidden = key === TERM_KEY ? termClosed || minimized.includes(TERM_KEY) : minimized.includes(key)
    if (isHidden) {
      if (key === TERM_KEY) setTermClosed(false)
      setMinimized((m) => m.filter((k) => k !== key))
      focus(key)
      return
    }
    if (top === key) {
      setMinimized((m) => [...new Set([...m, key])])
      return
    }
    focus(key)
  }

  const closeFromDock = (key) => {
    if (key === TERM_KEY) setTermClosed(true)
    else closeWindow(key)
  }

  return (
    <div
      className="desktop"
      style={{ backgroundImage: 'url(' + import.meta.env.BASE_URL + 'wallpaper.svg)' }}
    >
      <div className="desktop__glow" aria-hidden="true" />

      <div className="desktop__mark" aria-hidden="true">
        <span>KolalitaOS</span>
        <i />
      </div>

      <DesktopIcons items={['aboutme', 'projects', 'cv', 'contact']} onOpen={openWindow} />

      <Cursor />

      <div className="menubar" aria-hidden="true">
        <span className="menubar__apple">&#xF8FF;</span>
        <span className="menubar__item menubar__item--bold">Portfolio</span>
        <span className="menubar__item">{t('Archivo', 'File')}</span>
        <span className="menubar__item">{t('Ver', 'View')}</span>
        <span className="menubar__item">{t('Ventana', 'Window')}</span>
        <span className="menubar__spacer" />
        <span className="menubar__item">adriano</span>
      </div>

      {!termClosed && (
        <Terminal
          ctx={ctx}
          focused={stack[stack.length - 1] === TERM_KEY}
          minimized={minimized.includes(TERM_KEY)}
          onFocus={() => focus(TERM_KEY)}
          onMinimize={() => setMinimized((m) => [...new Set([...m, TERM_KEY])])}
          onClose={() => setTermClosed(true)}
        />
      )}

      {open.map(({ id, pos }) => {
        const spec = WINDOWS[id]
        const Body = spec.body
        return (
          <Window
            key={id}
            spec={spec}
            initial={pos}
            z={100 + Math.max(0, stack.indexOf(id))}
            minimized={minimized.includes(id)}
            onFocus={() => focus(id)}
            onMinimize={() => setMinimized((m) => [...new Set([...m, id])])}
            onClose={() => closeWindow(id)}
          >
            <Body open={openWindow} t={t} />
          </Window>
        )
      })}

      <Dock items={dockItems} onActivate={activate} onClose={closeFromDock} />
    </div>
  )
}
