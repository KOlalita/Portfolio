import { useState } from 'react'
import { BIO, FACTS, PROFILE } from '../data/content.jsx'
import { useLang } from '../i18n.jsx'

/* Avatar de respaldo si la foto remota no carga. */
const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#2a2140"/>
      <circle cx="50" cy="38" r="17" fill="#c792ea"/>
      <path d="M12 94c0-21 17-32 38-32s38 11 38 32z" fill="#c792ea"/>
    </svg>`
  )

/* Bienvenida con formato neofetch: retrato a la izquierda, ficha a la derecha. */
export default function Welcome() {
  const { t } = useLang()
  const [src, setSrc] = useState(PROFILE.avatar)

  return (
    <div className="fetch">
      <div className="fetch__portrait">
        <img
          className="fetch__img"
          src={src}
          alt={t('Foto de ', 'Photo of ') + PROFILE.name}
          onError={() => setSrc(FALLBACK)}
        />
        <div className="fetch__scan" aria-hidden="true" />
      </div>

      <div className="fetch__info">
        <div className="fetch__id">
          <span className="fetch__user">{PROFILE.handle.toLowerCase()}</span>
          <span className="fetch__at">@</span>
          <span className="fetch__host">portfolio</span>
        </div>
        <div className="fetch__rule" />

        <dl className="fetch__facts">
          {FACTS.map((f) => (
            <div className="fetch__fact" key={f.k}>
              <dt>{f.k}</dt>
              <dd>
                {f.href ? (
                  <a href={f.href} target="_blank" rel="noreferrer">
                    {f.v(t)}
                  </a>
                ) : (
                  f.v(t)
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="fetch__bio">{BIO(t)}</p>

        <div className="fetch__swatches" aria-hidden="true">
          {['#ff5f57', '#febc2e', '#28c840', '#67d4e8', '#c792ea', '#f2904a'].map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  )
}
