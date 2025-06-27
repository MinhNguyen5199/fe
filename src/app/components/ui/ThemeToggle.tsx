'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    setTheme(stored || 'system')
  }, [])

  const changeTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
    const root = document.documentElement
    root.classList.remove('dark')
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark')
    }
  }

  if (theme === null) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <button onClick={() => changeTheme('light')} className={theme === 'light' ? 'font-bold' : ''}>Light</button>
      <button onClick={() => changeTheme('dark')} className={theme === 'dark' ? 'font-bold' : ''}>Dark</button>
      <button onClick={() => changeTheme('system')} className={theme === 'system' ? 'font-bold' : ''}>System</button>
    </div>
  )
}