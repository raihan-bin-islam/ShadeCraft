"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
}

type ThemeProviderState = {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function CustomThemeProvider({ children, defaultTheme = "aurora" }: ThemeProviderProps) {
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement

    // Remove any previous theme
    const dataThemes = root.getAttribute("data-theme")
    if (dataThemes) {
      root.removeAttribute("data-theme")
    }

    // Set the new theme
    root.setAttribute("data-theme", theme)
  }, [theme])

  const value = {
    theme,
    setTheme,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
