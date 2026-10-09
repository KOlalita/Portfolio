import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export const LANGS = ['es', 'en']
const STORAGE_KEY = 'portfolio.lang'

const LangContext = createContext({ lang: 'es', setLang: () => {}, t: (es) => es })

function readStored() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return LANGS.includes(v) ? v : null
  } catch {
    return null
  }
}

/* Ingles por defecto: el portfolio se dirige sobre todo a empleadores. */
const DEFAULT_LANG = 'en'

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => readStored() || DEFAULT_LANG)

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* modo privado o almacenamiento bloqueado: la eleccion dura la sesion */
    }
    document.documentElement.lang = next
  }, [])

  const value = useMemo(
    () => ({ lang, setLang, t: (es, en) => (lang === 'es' ? es : en) }),
    [lang, setLang]
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

/* Version sin hooks, para modulos que no son componentes (commands.js). */
export function translator(lang) {
  return (es, en) => (lang === 'es' ? es : en)
}
