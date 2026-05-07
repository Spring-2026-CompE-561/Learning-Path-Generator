"use client"

import * as React from "react"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

// aria-label depends on the resolved theme (only known on the client). render a
// generic label until mounted so SSR and the first client render agree, then
// swap to the dynamic label after hydration. without this gate the server
// renders "Switch to dark mode" and the client renders "Switch to light mode"
// (or vice versa), tripping a hydration warning that breaks event binding.
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const next = resolvedTheme === "dark" ? "light" : "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      aria-label={mounted ? `Switch to ${next} mode` : "Toggle theme"}
      onClick={() => setTheme(next)}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
