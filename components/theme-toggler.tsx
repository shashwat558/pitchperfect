"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme" className="text-sm text-gray-600">
        Theme:
      </label>

      <select
        id="theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="px-2 py-1 rounded-md border border-gray-300 text-sm bg-white dark:bg-gray-800 dark:text-gray-100"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  )
}
