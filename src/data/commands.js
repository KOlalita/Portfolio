import { WINDOWS, PROFILE, resolveWindowId } from './content.jsx'
import { translator } from '../i18n.jsx'

/*
 * Registro de comandos de la terminal.
 *
 * Cada comando recibe (args, ctx, t) y devuelve una de estas formas:
 *   - { lines, cls }   -> lineas impresas, con una clase de estilo opcional
 *   - { node }         -> un bloque React ('help' | 'welcome')
 *   - null             -> sin salida
 * ctx expone: open(id), close(id), closeAll(), clear(), minimizeAll(), list(),
 * lang y setLang(code).
 */

const TARGETS = Object.values(WINDOWS)
  .map((w) => w.label)
  .join(', ')

export function helpLines(lang) {
  const t = translator(lang)
  const W = t('<ventana>', '<window>') // marcador del argumento
  return [
    { t: 'h', text: t('COMANDOS DISPONIBLES', 'AVAILABLE COMMANDS') },
    { t: 'c', cmd: 'help', desc: t('muestra esta guia (alias: /help, ?)', 'show this guide (alias: /help, ?)') },
    { t: 'c', cmd: 'open new --' + W, desc: t('abre una ventana flotante', 'open a floating window') },
    { t: 'c', cmd: 'open --' + W, desc: t('forma corta de lo anterior', 'short form of the above') },
    { t: 'c', cmd: 'ls', desc: t('lista las ventanas disponibles', 'list the available windows') },
    { t: 'c', cmd: 'ls --open', desc: t('lista las ventanas abiertas ahora', 'list the currently open windows') },
    { t: 'c', cmd: 'close --' + W, desc: t('cierra una ventana', 'close a window') },
    { t: 'c', cmd: 'close --all', desc: t('cierra todas las ventanas', 'close every window') },
    { t: 'c', cmd: 'minimize --all', desc: t('minimiza todas las ventanas', 'minimize every window') },
    { t: 'c', cmd: 'whoami', desc: t('resumen rapido del perfil', 'quick profile summary') },
    { t: 'c', cmd: 'banner', desc: t('vuelve a imprimir la ficha de bienvenida', 'reprint the welcome card') },
    { t: 'c', cmd: 'lang <es|en>', desc: t('cambia el idioma (igual que el interruptor)', 'switch language (same as the toggle)') },
    { t: 'c', cmd: 'cv', desc: t('atajo para abrir el curriculum', 'shortcut to open the resume') },
    { t: 'c', cmd: 'contact', desc: t('atajo para abrir el contacto', 'shortcut to open contact') },
    { t: 'c', cmd: 'projects', desc: t('atajo para abrir los proyectos', 'shortcut to open projects') },
    { t: 'c', cmd: 'neofetch', desc: t('ficha del sistema', 'system card') },
    { t: 'c', cmd: 'github', desc: t('abre github.com/', 'open github.com/') + PROFILE.handle },
    { t: 'c', cmd: 'linkedin', desc: t('abre mi perfil de LinkedIn', 'open my LinkedIn profile') },
    { t: 'c', cmd: 'clear', desc: t('limpia la terminal y reimprime la ficha (alias: cls)', 'clear the terminal and reprint the card (alias: cls)') },
    { t: 'b', text: '' },
    { t: 'd', text: t('VENTANAS: ', 'WINDOWS: ') + TARGETS },
    {
      t: 'd',
      text: t(
        'Tab autocompleta. Flechas arriba/abajo recorren el historial.',
        'Tab autocompletes. Up/down arrows walk the history.'
      ),
    },
  ]
}

export function welcomeLines(lang) {
  const t = translator(lang)
  return [
    { cls: '', text: '' },
    {
      cls: 'dim',
      text: t(
        'Esta terminal es la interfaz. Los comandos abren ventanas con el contenido.',
        'This terminal is the interface. Commands open windows with the content.'
      ),
    },
    { cls: '', text: '' },
    { cls: 'dim', text: t('Prueba:', 'Try:') },
    { cls: 'cmdhint', text: '  open new --AboutMe' },
    { cls: 'cmdhint', text: '  open new --Projects' },
    { cls: '', text: '' },
    {
      cls: 'dim',
      text: t(
        'Escribe help (o /help) para la lista completa de comandos.',
        'Type help (or /help) for the full list of commands.'
      ),
    },
  ]
}

function notFound(name, t) {
  return {
    cls: 'err',
    lines: [
      t('zsh: no existe la ventana "', 'zsh: no such window "') + name + '".',
      t('Ejecuta `ls` para ver las disponibles.', 'Run `ls` to see what is available.'),
    ],
  }
}

const commands = {
  help: { run: () => ({ node: 'help' }) },
  banner: { run: () => ({ node: 'welcome' }) },

  open: {
    run: (args, ctx, t) => {
      // Acepta: open new --AboutMe | open --AboutMe | open AboutMe
      const target = args.filter((a) => a.toLowerCase() !== 'new').pop()
      if (!target) {
        return {
          cls: 'err',
          lines: [
            t('uso: open new --<ventana>', 'usage: open new --<window>'),
            t('ejemplo: open new --AboutMe', 'example: open new --AboutMe'),
          ],
        }
      }
      const id = resolveWindowId(target)
      if (!id) return notFound(target, t)
      ctx.open(id)
      return { cls: 'ok', lines: [t('abriendo ', 'opening ') + WINDOWS[id].title + ' ...'] }
    },
  },

  close: {
    run: (args, ctx, t) => {
      const target = args[args.length - 1]
      if (!target) {
        return {
          cls: 'err',
          lines: [t('uso: close --<ventana> | close --all', 'usage: close --<window> | close --all')],
        }
      }
      if (/^-*all$/i.test(target)) {
        const n = ctx.list().length
        ctx.closeAll()
        return { cls: 'ok', lines: [n + t(' ventana(s) cerrada(s).', ' window(s) closed.')] }
      }
      const id = resolveWindowId(target)
      if (!id) return notFound(target, t)
      ctx.close(id)
      return { cls: 'ok', lines: [t('cerrando ', 'closing ') + WINDOWS[id].title + ' ...'] }
    },
  },

  minimize: {
    run: (args, ctx, t) => {
      ctx.minimizeAll()
      return { cls: 'ok', lines: [t('ventanas minimizadas a la task bar.', 'windows minimized to the task bar.')] }
    },
  },

  ls: {
    run: (args, ctx, t) => {
      if (args.some((a) => /^-*open$/i.test(a))) {
        const openIds = ctx.list()
        if (!openIds.length) return { cls: 'dim', lines: [t('no hay ventanas abiertas.', 'no windows open.')] }
        return { lines: openIds.map((id) => '  ' + WINDOWS[id].icon + '  ' + WINDOWS[id].title) }
      }
      return {
        lines: Object.values(WINDOWS).map(
          (w) => '  ' + w.icon + '  ' + w.label.padEnd(12) + ' open new --' + w.label
        ),
      }
    },
  },

  lang: {
    run: (args, ctx, t) => {
      const next = (args[0] || '').toLowerCase().replace(/^-+/, '')
      if (next !== 'es' && next !== 'en') {
        return {
          cls: 'err',
          lines: [
            t('uso: lang es | lang en', 'usage: lang es | lang en'),
            t('idioma actual: ', 'current language: ') + ctx.lang,
          ],
        }
      }
      ctx.setLang(next) // la terminal se reimprime sola en el idioma nuevo
      return null
    },
  },

  whoami: {
    run: (args, ctx, t) => ({
      lines: [
        PROFILE.name + ' (' + PROFILE.handle + ')',
        PROFILE.role + t(' — backend y aplicaciones web', ' — backend and web applications'),
        PROFILE.github,
        PROFILE.email,
        '',
        t('Detalle completo: open new --AboutMe', 'Full detail: open new --AboutMe'),
      ],
    }),
  },

  github: {
    run: (args, ctx, t) => {
      window.open(PROFILE.github, '_blank', 'noopener')
      return { cls: 'ok', lines: [t('abriendo ', 'opening ') + PROFILE.github + ' ...'] }
    },
  },

  linkedin: {
    run: (args, ctx, t) => {
      window.open(PROFILE.linkedin, '_blank', 'noopener')
      return { cls: 'ok', lines: [t('abriendo LinkedIn ...', 'opening LinkedIn ...')] }
    },
  },

  neofetch: {
    run: (args, ctx, t) => ({
      cls: 'neofetch',
      lines: [
        '       .--.        ' + PROFILE.handle.toLowerCase() + '@portfolio',
        '      |o_o |       ------------------',
        '      |:_/ |       OS      adriano-os 1.0.0',
        '     //   \\ \\      Shell   zsh 5.9',
        '    (|     | )     Stack   React + Vite',
        "   /'\\_   _/`\\     " + t('Rol', 'Role') + '     ' + PROFILE.role,
        '   \\___)=(___/     ' + t('Ventanas ', 'Windows ') + ctx.list().length + t(' abiertas', ' open'),
      ],
    }),
  },

  clear: { run: (args, ctx) => { ctx.clear(); return null } },

  // Atajos directos a ventanas
  cv: { run: (a, ctx, t) => { ctx.open('cv'); return { cls: 'ok', lines: [t('abriendo ', 'opening ') + 'cv.pdf ...'] } } },
  contact: { run: (a, ctx, t) => { ctx.open('contact'); return { cls: 'ok', lines: [t('abriendo ', 'opening ') + 'contact.sh ...'] } } },
  projects: { run: (a, ctx, t) => { ctx.open('projects'); return { cls: 'ok', lines: [t('abriendo ', 'opening ') + 'projects/ ...'] } } },
  skills: { run: (a, ctx, t) => { ctx.open('skills'); return { cls: 'ok', lines: [t('abriendo ', 'opening ') + 'skills.md ...'] } } },
  about: { run: (a, ctx, t) => { ctx.open('aboutme'); return { cls: 'ok', lines: [t('abriendo ', 'opening ') + 'aboutme.txt ...'] } } },
}

/* Alias de comandos. */
const ALIASES = {
  '/help': 'help',
  '?': 'help',
  man: 'help',
  ayuda: 'help',
  cls: 'clear',
  exit: 'clear',
  dir: 'ls',
  min: 'minimize',
  idioma: 'lang',
  language: 'lang',
  aboutme: 'about',
  'about-me': 'about',
  resume: 'cv',
  mail: 'contact',
}

export const COMMAND_NAMES = [...Object.keys(commands), ...Object.keys(ALIASES)]

export function runCommand(input, ctx) {
  const t = translator(ctx.lang)
  const parts = input.trim().split(/\s+/)
  const raw = (parts.shift() || '').toLowerCase()
  if (!raw) return null

  const name = commands[raw] ? raw : ALIASES[raw]
  const cmd = name && commands[name]

  if (!cmd) {
    return {
      cls: 'err',
      lines: [
        'zsh: command not found: ' + raw,
        t('Escribe `help` para ver los comandos.', 'Type `help` to list the commands.'),
      ],
    }
  }
  return cmd.run(parts, ctx, t)
}

/* Autocompletado con Tab: comandos y, tras `open`/`close`, nombres de ventana. */
export function complete(input) {
  const trimmed = input.replace(/^\s+/, '')
  const parts = trimmed.split(/\s+/)

  if (parts.length <= 1) {
    const m = COMMAND_NAMES.filter((c) => c.startsWith(parts[0].toLowerCase()))
    return m.length === 1 ? m[0] + ' ' : null
  }

  const head = parts[0].toLowerCase()
  if (head === 'open' || head === 'close') {
    const last = parts[parts.length - 1]
    const stripped = last.replace(/^-+/, '').toLowerCase()
    const m = Object.values(WINDOWS).filter((w) => w.label.toLowerCase().startsWith(stripped))
    if (m.length === 1) {
      parts[parts.length - 1] = '--' + m[0].label
      return parts.join(' ')
    }
  }
  return null
}
