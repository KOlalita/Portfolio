import { LANGS, useLang } from '../i18n.jsx'

/*
 * Interruptor de idioma del borde superior derecho de la terminal.
 * Dos segmentos con un pulgar deslizante; no arrastra la ventana al pulsarlo.
 */
export default function LangSwitch({ onChange }) {
  const { lang, setLang, t } = useLang()

  const pick = (next) => {
    if (next === lang) return
    setLang(next)
    onChange?.(next)
  }

  return (
    <div
      className="langsw"
      role="group"
      aria-label={t('Idioma', 'Language')}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <span
        className="langsw__thumb"
        style={{ transform: 'translateX(' + LANGS.indexOf(lang) * 100 + '%)' }}
        aria-hidden="true"
      />
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={'langsw__opt' + (lang === code ? ' is-on' : '')}
          aria-pressed={lang === code}
          onClick={() => pick(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
