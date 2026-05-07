"use client"

import { ThemeProvider } from "next-themes"

// wraps the app so next-themes can toggle the .dark class on <html>
// attribute="class" → switches via class instead of data-attribute
// defaultTheme="system" → matches the OS until the user picks one
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
