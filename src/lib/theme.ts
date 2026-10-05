import { useEffect, useState } from 'react'

/**
 * Theme state. The attribute lives on <html> so the CSS override in
 * tokens.css applies.
 *
 * Light is the default; dark only when the visitor picks it with the toggle.
 * The choice is stored only on toggle — the old key was written on every
 * load, so it holds values nobody chose and is deliberately not read.
 */

export type Theme = 'dark' | 'light'

const KEY = 'valentia-theme-choice' // keep in sync with the script in index.html

export function readTheme(): Theme {
  try {
    if (localStorage.getItem(KEY) === 'dark') return 'dark'
  } catch {
    // Private mode or blocked storage — use the default.
  }
  return 'light'
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'light') root.setAttribute('data-theme', 'light')
  else root.removeAttribute('data-theme')
  root.style.colorScheme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#f7f8fd' : '#0b0d1a')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === 'undefined' ? 'light' : readTheme(),
  )

  useEffect(() => applyTheme(theme), [theme])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Nothing to do — the theme still applies for this session.
    }
  }

  return [theme, toggle] as const
}
