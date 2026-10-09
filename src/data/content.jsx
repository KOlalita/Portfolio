/*
 * Contenido del portfolio.
 *
 * Cada `body` recibe { t, open }. `t(es, en)` devuelve la cadena del idioma
 * activo, asi que ambos textos viven juntos en el mismo punto del codigo.
 */

export const PROFILE = {
  name: 'Adriano Enrique Paniagua Quiroga',
  handle: 'KOlalita',
  role: 'Software Developer',
  location: 'Arequipa, Peru',
  email: 'adriano31agosto@gmail.com',
  github: 'https://github.com/KOlalita',
  linkedin: 'https://www.linkedin.com/in/adriano-enrique-paniagua-quiroga-ab97bb2b8/',
  /* BASE_URL respeta el `base` de Vite: funciona tambien bajo un subpath. */
  cvUrl: import.meta.env.BASE_URL + 'CV-Adriano-Paniagua-Quiroga.pdf',
  /*
   * Paginas del CV rasterizadas para verlas dentro del sitio. Se regeneran con
   * `npm run cv:render` cada vez que cambie el PDF.
   */
  cvPages: [import.meta.env.BASE_URL + 'cv-page-1.webp'],
  /* Placeholder: sustituir por una foto propia en public/ (ej. '/avatar.jpg'). */
  avatar: 'https://placecats.com/400/400',
}

/*
 * Repositorios por proyecto. En null mientras el repo sea privado: la ventana
 * muestra una nota en vez de un boton que no lleva a ningun sitio.
 */
const REPOS = {
  cutzen: null,
  remafeed: null,
}

/* Ficha corta de la bienvenida. Los valores son funciones de `t`. */
export const FACTS = [
  { k: 'Role', v: () => PROFILE.role },
  { k: 'Focus', v: (t) => t('Backend · Aplicaciones web', 'Backend · Web Applications') },
  { k: 'Stack', v: () => 'C# · .NET · SQL Server · React' },
  {
    k: 'Learning',
    v: (t) => t('Arquitectura de sistemas · Bases de datos', 'System architecture · Databases'),
  },
  { k: 'Location', v: (t) => t('Arequipa, Peru · Remoto', 'Arequipa, Peru · Remote') },
  { k: 'GitHub', v: () => 'github.com/' + PROFILE.handle, href: PROFILE.github },
  { k: 'LinkedIn', v: (t) => t('perfil profesional', 'professional profile'), href: PROFILE.linkedin },
  { k: 'Email', v: () => PROFILE.email, href: 'mailto:' + PROFILE.email },
]

export const BIO = (t) =>
  t(
    'Desarrollador de software centrado en backend y aplicaciones web. Disfruto construyendo software practico y aprendiendo sobre arquitectura de sistemas, bases de datos y tecnologias web modernas.',
    'Software developer focused on backend and web applications. I enjoy building practical software and learning about system architecture, databases, and modern web technologies.'
  )

/* Enlace a un repositorio, o una nota si todavia es privado. */
function RepoLink({ url, t }) {
  if (!url) {
    return <p className="hint">{t('Repositorio privado por ahora.', 'Repository is private for now.')}</p>
  }
  return (
    <div className="links">
      <a className="linkbtn" href={url} target="_blank" rel="noreferrer">
        {t('Repositorio', 'Repository')}
      </a>
    </div>
  )
}

/* Cada "ventana" se declara aqui. `id` es lo que acepta `open new --<id>`. */
export const WINDOWS = {
  aboutme: {
    id: 'aboutme',
    title: 'aboutme.txt',
    label: 'AboutMe',
    icon: '[ ~ ]',
    size: { w: 580, h: 450 },
    body: ({ t }) => (
      <>
        <h1>{PROFILE.name}</h1>
        <p className="subtitle">
          {PROFILE.role} · {t('Arequipa, Peru', 'Arequipa, Peru')}
        </p>
        <p>{BIO(t)}</p>
        <p>
          {t(
            'Vengo de una formacion  trilingue y me pase al desarrollo de software por la via practica: construyendo cosas que alguien pudiera usar de verdad. Me formé como desarrollador full-stack en C# en Tecsup y desde entonces trabajo sobre todo en el backend.',
            'I come from a trilingual background and moved into software the practical way: by building things someone could actually use. I trained as a full-stack C# developer at Tecsup, and since then I have worked mostly on the backend.'
          )}
        </p>
        <p>
          {t(
            'Lo que mas me interesa es la parte que no se ve: como se modela un dominio, como se decide que modulo es dueño de que, y por que una decision de diseño envejece bien o mal.',
            'What interests me most is the part you do not see: how a domain gets modelled, how you decide which module owns what, and why a design decision ages well or badly.'
          )}
        </p>
        <h2>{t('En una linea', 'In one line')}</h2>
        <ul>
          <li>{t('C# y .NET como terreno principal.', 'C# and .NET as my main ground.')}</li>
          <li>
            {t(
              'Escribo la documentacion antes que el codigo cuando el problema lo merece.',
              'I write the documentation before the code when the problem deserves it.'
            )}
          </li>
          <li>{t('Español nativo, ingles B2.', 'Native Spanish, B2 English.')}</li>
        </ul>
        <p className="hint">
          {t('Siguiente paso:', 'Next step:')} <code>open new --Projects</code>
        </p>
      </>
    ),
  },

  skills: {
    id: 'skills',
    title: 'skills.md',
    label: 'Skills',
    icon: '[ * ]',
    size: { w: 540, h: 470 },
    body: ({ t }) => (
      <>
        <h1>{t('Habilidades', 'Skills')}</h1>
        <h2>Backend</h2>
        <ul>
          <li>C#, .NET 8 / .NET 10</li>
          <li>ASP.NET Core Web API, {t('controladores, DTOs, validaciones', 'controllers, DTOs, validation')}</li>
          <li>{t('Autenticacion JWT, roles y autorizacion', 'JWT authentication, roles and authorization')}</li>
          <li>Entity Framework Core, LINQ, {t('migraciones', 'migrations')}</li>
        </ul>
        <h2>{t('Bases de datos', 'Databases')}</h2>
        <ul>
          <li>Microsoft SQL Server</li>
          <li>PostgreSQL (Supabase)</li>
        </ul>
        <h2>Frontend</h2>
        <ul>
          <li>React, TypeScript, Vite, React Router</li>
          <li>Tailwind CSS, Bootstrap, {t('CSS moderno', 'modern CSS')}</li>
          <li>ASP.NET Razor, HTML, JavaScript</li>
        </ul>
        <h2>{t('Practicas', 'Practices')}</h2>
        <ul>
          <li>{t('SOLID, patrones de diseño, refactorizacion', 'SOLID, design patterns, refactoring')}</li>
          <li>{t('Pruebas unitarias y depuracion', 'Unit testing and debugging')}</li>
          <li>{t('Documentacion de codigo y de arquitectura', 'Code and architecture documentation')}</li>
          <li>{t('Metodologias agiles, Git y GitHub', 'Agile methodologies, Git and GitHub')}</li>
        </ul>
        <h2>{t('Blandas', 'Soft skills')}</h2>
        <ul>
          <li>
            {t(
              'Especificacion y analisis de requerimientos',
              'Requirements specification and analysis'
            )}
          </li>
          <li>{t('Comunicacion de ideas tecnicas', 'Communicating technical ideas')}</li>
          <li>
            {t(
              'Criterio para evaluar y corregir codigo propio y ajeno',
              'Judgement to review and fix my own code and other people’s'
            )}
          </li>
        </ul>
      </>
    ),
  },

  tech: {
    id: 'tech',
    title: 'stack.json',
    label: 'Tech',
    icon: '[ # ]',
    size: { w: 560, h: 420 },
    body: ({ t }) => (
      <>
        <h1>Stack</h1>
        <p>{t('Lo que uso a diario y lo que estoy explorando.', 'What I use daily and what I am exploring.')}</p>
        <h2>{t('Diario', 'Daily')}</h2>
        <div className="chips">
          {[
            'C#',
            '.NET',
            'ASP.NET Core',
            'EF Core',
            'SQL Server',
            'React',
            'TypeScript',
            'Vite',
            'Tailwind',
            'Git',
          ].map((x) => (
            <span className="chip" key={x}>{x}</span>
          ))}
        </div>
        <h2>{t('Explorando', 'Exploring')}</h2>
        <div className="chips">
          {['PostgreSQL', 'Supabase', 'Docker', t('Web scraping', 'Web scraping'), t('Jobs programados', 'Scheduled jobs')].map(
            (x) => (
              <span className="chip chip--ghost" key={x}>{x}</span>
            )
          )}
        </div>
        <p className="hint">
          {t(
            'Herramientas: Visual Studio, VS Code, Swagger, GitHub.',
            'Tooling: Visual Studio, VS Code, Swagger, GitHub.'
          )}
        </p>
      </>
    ),
  },

  projects: {
    id: 'projects',
    title: 'projects/',
    label: 'Projects',
    icon: '[ / ]',
    size: { w: 580, h: 410 },
    body: ({ t, open }) => (
      <>
        <h1>{t('Proyectos', 'Projects')}</h1>
        <p>{t('Clic para abrir la ficha de cada uno.', 'Click to open each project card.')}</p>
        <div className="cards">
          <button className="card" onClick={() => open('cutzen')}>
            <span className="card__title">CutZen</span>
            <span className="card__desc">
              {t(
                'Reservas de barberia con API .NET y tres roles de usuario.',
                'Barbershop booking with a .NET API and three user roles.'
              )}
            </span>
            <span className="card__cmd">open new --Cutzen</span>
          </button>
          <button className="card" onClick={() => open('remafeed')}>
            <span className="card__title">RemaFeed</span>
            <span className="card__desc">
              {t(
                'Buscador y seguimiento de remates judiciales del Peru.',
                'Discovery and tracking for Peruvian judicial auctions.'
              )}
            </span>
            <span className="card__cmd">open new --RemaFeed</span>
          </button>
        </div>
      </>
    ),
  },

  cutzen: {
    id: 'cutzen',
    title: 'cutzen — README.md',
    label: 'Cutzen',
    icon: '[ 1 ]',
    size: { w: 600, h: 500 },
    body: ({ t }) => (
      <>
        <h1>CutZen</h1>
        <p className="subtitle">
          {t('Plataforma de reservas para barberias', 'Booking platform for barbershops')}
        </p>
        <div className="chips">
          {['C#', '.NET 8', 'ASP.NET Core', 'EF Core', 'SQL Server', 'JWT', 'React', 'Tailwind'].map((x) => (
            <span className="chip" key={x}>{x}</span>
          ))}
        </div>
        <h2>{t('Que es', 'What it is')}</h2>
        <p>
          {t(
            'Una API REST en .NET con un cliente React donde conviven tres roles: cliente, barbero y administrador. Cada uno entra a la misma aplicacion y ve un panel distinto.',
            'A .NET REST API with a React client where three roles coexist: client, barber and admin. Each signs into the same application and gets a different dashboard.'
          )}
        </p>
        <h2>{t('Lo que resuelve', 'What it solves')}</h2>
        <ul>
          <li>
            {t(
              'El barbero define su disponibilidad por dia de la semana, con descansos opcionales.',
              'The barber sets availability per weekday, with optional breaks.'
            )}
          </li>
          <li>
            {t(
              'El cliente reserva sobre huecos reales calculados a partir de esa disponibilidad y de la duracion del servicio.',
              'The client books against real slots computed from that availability and the service duration.'
            )}
          </li>
          <li>
            {t(
              'El administrador gestiona barberos, servicios, clientes y citas, con borrado logico en vez de borrado real.',
              'The admin manages barbers, services, clients and appointments, with soft deletes instead of real ones.'
            )}
          </li>
        </ul>
        <h2>{t('Lo que aprendi', 'What I learned')}</h2>
        <ul>
          <li>
            {t(
              'Calcular huecos libres es mas dificil que guardarlos: hay que cruzar disponibilidad, descansos, duracion y citas ya tomadas.',
              'Computing free slots is harder than storing them: you have to cross availability, breaks, duration and existing appointments.'
            )}
          </li>
          <li>
            {t(
              'Separar controladores, servicios e interfaces desde el principio hizo que añadir el rol de admin no tocara el codigo del cliente.',
              'Separating controllers, services and interfaces from the start meant adding the admin role did not touch the client code.'
            )}
          </li>
          <li>
            {t(
              'JWT con roles, hash de contraseñas con BCrypt y migraciones de EF Core sobre un esquema que cambio cinco veces.',
              'JWT with roles, BCrypt password hashing, and EF Core migrations over a schema that changed five times.'
            )}
          </li>
        </ul>
        <RepoLink url={REPOS.cutzen} t={t} />
      </>
    ),
  },

  remafeed: {
    id: 'remafeed',
    title: 'remafeed — README.md',
    label: 'RemaFeed',
    icon: '[ 2 ]',
    size: { w: 600, h: 500 },
    body: ({ t }) => (
      <>
        <h1>RemaFeed</h1>
        <p className="subtitle">
          {t(
            'Remates judiciales del Peru, buscables y seguibles',
            'Peruvian judicial auctions, searchable and followable'
          )}
        </p>
        <div className="chips">
          {['C#', '.NET 10', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'Supabase', 'React', 'TypeScript'].map(
            (x) => (
              <span className="chip" key={x}>{x}</span>
            )
          )}
        </div>
        <h2>{t('Que es', 'What it is')}</h2>
        <p>
          {t(
            'Los remates judiciales se publican en REMAJU, pero encontrarlos y seguirlos es incomodo. RemaFeed los rastrea de forma programada y construye encima descubrimiento, seguimiento y avisos.',
            'Judicial auctions are published on REMAJU, but finding and following them is awkward. RemaFeed crawls them on a schedule and layers discovery, tracking and alerts on top.'
          )}
        </p>
        <h2>{t('Como esta construido', 'How it is built')}</h2>
        <ul>
          <li>
            {t(
              'Monolito modular: un solo desplegable partido por dominio, donde los modulos se hablan por interfaces y nunca por las tablas del otro.',
              'A modular monolith: one deployable partitioned by domain, where modules talk through interfaces and never through each other’s tables.'
            )}
          </li>
          <li>
            {t(
              'Identidad con Supabase Auth y JWT asimetrico (ES256) verificado por JWKS.',
              'Identity via Supabase Auth with asymmetric JWT (ES256) verified through JWKS.'
            )}
          </li>
          <li>
            {t(
              'Se entrega un modulo a la vez, API y UI en la misma pasada: un endpoint sin pantalla que lo use no cuenta como terminado.',
              'One module at a time, API and UI in the same pass: an endpoint with no screen to reach it does not count as done.'
            )}
          </li>
        </ul>
        <h2>{t('Lo que aprendi', 'What I learned')}</h2>
        <ul>
          <li>
            {t(
              'Cada importe lleva su propia moneda y su tipo de cambio, el que publico el remate, no el de hoy.',
              'Every money field carries its own currency and exchange rate: the one the auction was published with, not today’s.'
            )}
          </li>
          <li>
            {t(
              'Explore y Mapa comparten el vocabulario de filtros pero no el motor de busqueda: son patrones de acceso distintos que no deben acoplarse.',
              'Explore and Map share the filter vocabulary but not the search engine: different access patterns that should not be coupled.'
            )}
          </li>
          <li>
            {t(
              'Cancelar un modulo ya diseñado tambien es una decision: el modulo de divisas se elimino al descubrir que REMAJU ya publica el tipo de cambio.',
              'Cancelling an already-designed module is also a decision: the currency module was dropped once REMAJU turned out to publish the rate inline.'
            )}
          </li>
        </ul>
        <RepoLink url={REPOS.remafeed} t={t} />
      </>
    ),
  },

  cv: {
    id: 'cv',
    title: 'cv.pdf',
    label: 'CV',
    icon: '[ = ]',
    size: { w: 580, h: 480 },
    body: ({ t, open }) => (
      <>
        <h1>{t('Curriculum', 'Resume')}</h1>
        <p className="subtitle">
          {PROFILE.name} · {PROFILE.location}
        </p>

        <h2>{t('Formacion', 'Education')}</h2>
        <ul>
          <li>
            <strong>2025 — 2026</strong> · {t('Tecsup, Lima', 'Tecsup, Lima')} —{' '}
            {t(
              'Desarrollador de Software Full-Stack en C#. 250 h online, metodologias agiles. Nivel 4 EQF-MEC.',
              'Full-Stack Software Developer in C#. 250 h online, agile methodologies. EQF level 4.'
            )}
          </li>
          <li>
            <strong>2012 — 2025</strong> · {t('Colegio Internacional Peruano Britanico, Arequipa', 'Colegio Internacional Peruano Britanico, Arequipa')} —{' '}
            {t(
              'Educacion basica completa con enfoque bilingue ingles/español.',
              'Full primary and secondary education with a bilingual English/Spanish focus.'
            )}
          </li>
          <li>
            <strong>2024 — 2026</strong> · {t('Formación Autodidacta', 'Self-taught Education')} —{' '}
          </li>
        </ul>

        <h2>{t('Proyectos', 'Projects')}</h2>
        <ul>
          <li>
            <strong>CutZen</strong> —{' '}
            {t('API .NET y cliente React para reservas de barberia.', '.NET API and React client for barbershop booking.')}
          </li>
          <li>
            <strong>RemaFeed</strong> —{' '}
            {t(
              'Monolito modular en .NET sobre remates judiciales del Peru.',
              'Modular .NET monolith over Peruvian judicial auctions.'
            )}
          </li>
        </ul>

        <h2>{t('Capacidades', 'Capabilities')}</h2>
        <ul>
          <li>{t('Trabajo en equipo y metodologias agiles', 'Teamwork and agile methodologies')}</li>
          <li>
            {t('Especificacion y analisis de requerimientos', 'Software requirements specification and analysis')}
          </li>
          <li>{t('Resolucion de problemas y pensamiento logico', 'Problem solving and logical thinking')}</li>
          <li>{t('Gestion de incidentes tecnicos', 'Technical incident management')}</li>
        </ul>

        <h2>{t('Idiomas', 'Languages')}</h2>
        <ul>
          <li>{t('Español — nativo', 'Spanish — native')}</li>
          <li>{t('Ingles — B2', 'English — B2')}</li>
          <li>{t('Frances — A1', 'French — A1')}</li>
        </ul>

        <div className="links">
          <button className="linkbtn linkbtn--primary" onClick={() => open('cvpdf')}>
            {t('Ver el PDF', 'View the PDF')}
          </button>
          <a className="linkbtn" href={PROFILE.cvUrl} target="_blank" rel="noreferrer" download>
            {t('Descargar PDF', 'Download PDF')}
          </a>
          <button className="linkbtn" onClick={() => open('contact')}>
            {t('Contacto', 'Contact')}
          </button>
        </div>
      </>
    ),
  },

  cvpdf: {
    id: 'cvpdf',
    title: 'cv.pdf',
    label: 'CV.pdf',
    icon: '[ P ]',
    size: { w: 600, h: 640 },
    bare: true, // el visor gestiona su propio padding
    body: ({ t }) => (
      <div className="pdf">
        <div className="pdf__bar">
          <span className="pdf__name">CV-Adriano-Paniagua-Quiroga.pdf</span>
          <span className="pdf__pages">
            {PROFILE.cvPages.length} {t('pag.', 'page')}
          </span>
          <a className="pdf__btn" href={PROFILE.cvUrl} target="_blank" rel="noreferrer" download>
            {t('Descargar', 'Download')}
          </a>
        </div>
        <div className="pdf__scroll">
          {PROFILE.cvPages.map((src, i) => (
            <img
              key={src}
              className="pdf__page"
              src={src}
              alt={t('CV, pagina ', 'Resume, page ') + (i + 1)}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    ),
  },

  contact: {
    id: 'contact',
    title: 'contact.sh',
    label: 'Contact',
    icon: '[ @ ]',
    size: { w: 500, h: 370 },
    body: ({ t }) => (
      <>
        <h1>{t('Contacto', 'Contact')}</h1>
        <p>
          {t(
            'La via mas rapida es el correo. Respondo en menos de 24 h.',
            'Email is the fastest route. I reply within 24 h.'
          )}
        </p>
        <div className="links links--col">
          <a className="linkbtn" href={'mailto:' + PROFILE.email}>{PROFILE.email}</a>
          <a className="linkbtn" href={PROFILE.github} target="_blank" rel="noreferrer">
            GitHub — github.com/{PROFILE.handle}
          </a>
          <a className="linkbtn" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
            LinkedIn — {t('perfil profesional', 'professional profile')}
          </a>
          <a className="linkbtn" href={PROFILE.cvUrl} target="_blank" rel="noreferrer" download>
            {t('Descargar CV (PDF)', 'Download resume (PDF)')}
          </a>
        </div>
        <p className="hint">{PROFILE.location}</p>
      </>
    ),
  },
}

/* Alias aceptados por `open new --<alias>` (todo en minusculas). */
export const WINDOW_ALIASES = {
  about: 'aboutme',
  'about-me': 'aboutme',
  about_me: 'aboutme',
  me: 'aboutme',
  habilidades: 'skills',
  skill: 'skills',
  stack: 'tech',
  tecnologias: 'tech',
  technologies: 'tech',
  project: 'projects',
  proyectos: 'projects',
  work: 'projects',
  resume: 'cv',
  curriculum: 'cv',
  contacto: 'contact',
  mail: 'contact',
  email: 'contact',
  linkedin: 'contact',
  pdf: 'cvpdf',
  'cv.pdf': 'cvpdf',
}

export function resolveWindowId(raw) {
  if (!raw) return null
  const key = String(raw).toLowerCase().replace(/^-+/, '').replace(/\s+/g, '')
  if (WINDOWS[key]) return key
  return WINDOW_ALIASES[key] ?? null
}
