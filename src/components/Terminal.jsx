import { useEffect, useRef, useState } from 'react'
import LangSwitch from './LangSwitch.jsx'
import TrafficLights from './TrafficLights.jsx'
import Welcome from './Welcome.jsx'
import { complete, helpLines, runCommand, welcomeLines } from '../data/commands.js'
import { useLang } from '../i18n.jsx'

const PROMPT_USER = 'adriano'
const PROMPT_HOST = 'portfolio'
const PROMPT_PATH = '~'

let uid = 0
const nextId = () => 'l' + ++uid

function HelpBlock() {
  const { lang } = useLang()
  return (
    <div className="help">
      {helpLines(lang).map((l, i) => {
        if (l.t === 'h') return <div className="help__h" key={i}>{l.text}</div>
        if (l.t === 'b') return <div className="help__b" key={i} />
        if (l.t === 'd') return <div className="help__d" key={i}>{l.text}</div>
        return (
          <div className="help__row" key={i}>
            <code className="help__cmd">{l.cmd}</code>
            <span className="help__desc">{l.desc}</span>
          </div>
        )
      })}
    </div>
  )
}

/* Estado inicial de la terminal: ficha de bienvenida + pistas. */
function freshLines(lang) {
  return [
    { id: nextId(), node: 'welcome' },
    ...welcomeLines(lang).map((w) => ({ id: nextId(), cls: w.cls, text: w.text })),
  ]
}

export default function Terminal({ ctx, focused, onFocus, onMinimize, onClose, minimized }) {
  const { lang, setLang } = useLang()
  const [lines, setLines] = useState(() => freshLines(lang))
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(-1)
  const [zoomed, setZoomed] = useState(false)
  const [closing, setClosing] = useState(false)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  const print = (payload) => {
    if (!payload) return
    if (payload.node) {
      setLines((l) => [...l, { id: nextId(), node: payload.node }])
      return
    }
    const cls = payload.cls || ''
    const arr = Array.isArray(payload) ? payload : payload.lines || [payload.text]
    setLines((l) => [...l, ...arr.map((text) => ({ id: nextId(), cls, text }))])
  }

  // `clear` y `lang` los dispara el registro de comandos via contexto.
  // Limpiar deja la terminal como recien abierta: con la ficha de bienvenida.
  const termCtx = { ...ctx, lang, setLang, clear: () => setLines(freshLines(lang)) }

  /*
   * Al cambiar de idioma la terminal se reinicia, como un shell nuevo: mezclar
   * salida vieja en otro idioma con la nueva queda sucio.
   */
  const prevLang = useRef(lang)
  useEffect(() => {
    if (prevLang.current === lang) return
    prevLang.current = lang
    setLines(freshLines(lang))
    setHistory([])
    setCursor(-1)
    setValue('')
  }, [lang])

  const submit = (e) => {
    e.preventDefault()
    const input = value
    setLines((l) => [...l, { id: nextId(), echo: input }])
    setValue('')
    if (input.trim()) {
      setHistory((h) => [input, ...h])
      print(runCommand(input, termCtx))
    }
    setCursor(-1)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const c = complete(value)
      if (c) setValue(c)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const i = Math.min(cursor + 1, history.length - 1)
      if (i >= 0) {
        setCursor(i)
        setValue(history[i])
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = cursor - 1
      setCursor(i)
      setValue(i >= 0 ? history[i] : '')
      return
    }
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setLines(freshLines(lang))
    }
  }

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])

  useEffect(() => {
    if (focused && !minimized) inputRef.current?.focus()
  }, [focused, minimized])

  return (
    <section
      className={
        'win term' +
        (focused ? ' term--focused' : '') +
        (minimized ? ' win--minimized' : '') +
        (zoomed ? ' term--zoomed' : '') +
        (closing ? ' win--closing' : '')
      }
      onMouseDown={onFocus}
      style={{ zIndex: ctx.termZ }}
    >
      <header className="win__bar" onDoubleClick={() => setZoomed((v) => !v)}>
        <TrafficLights
          onClose={() => {
            // Deja correr el rebote antes de que el padre la desmonte.
            setClosing(true)
            window.setTimeout(onClose, 280)
          }}
          onMinimize={onMinimize}
          onZoom={() => setZoomed((v) => !v)}
          zoomed={zoomed}
        />
        <span className="win__title">
          {PROMPT_USER + '@' + PROMPT_HOST} — zsh — 100x32
        </span>
        <LangSwitch />
      </header>

      <div className="term__body" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
        {lines.map((l) =>
          l.node === 'help' ? (
            <HelpBlock key={l.id} />
          ) : l.node === 'welcome' ? (
            <Welcome key={l.id} />
          ) : l.echo !== undefined ? (
            <div className="term__line" key={l.id}>
              <Prompt />
              <span className="term__echo">{l.echo}</span>
            </div>
          ) : (
            <div className={'term__line term__out ' + (l.cls || '')} key={l.id}>
              {l.text || ' '}
            </div>
          )
        )}

        <form className="term__line term__input" onSubmit={submit}>
          <Prompt />
          <span className="term__field">
            <input
              ref={inputRef}
              value={value}
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              aria-label={lang === 'es' ? 'Entrada de comandos' : 'Command input'}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <span className="term__caret" style={{ left: value.length + 'ch' }} />
          </span>
        </form>
      </div>
    </section>
  )
}

function Prompt() {
  return (
    <span className="prompt">
      <span className="prompt__user">{PROMPT_USER}</span>
      <span className="prompt__at">@</span>
      <span className="prompt__host">{PROMPT_HOST}</span>
      <span className="prompt__path"> {PROMPT_PATH}</span>
      <span className="prompt__sig"> %</span>
    </span>
  )
}
