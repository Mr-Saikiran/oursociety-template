'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

const order = ['system', 'light', 'dark'] as const
const labels = { system: 'System theme', light: 'Light theme', dark: 'Dark theme' }

// Cycles system → light → dark. Renders a placeholder until mounted to avoid a hydration mismatch.
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const current = (mounted && (theme as (typeof order)[number])) || 'system'
  const next = order[(order.indexOf(current) + 1) % order.length]
  const Icon = current === 'dark' ? Moon : current === 'light' ? Sun : Monitor

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`${labels[current]}. Switch to ${labels[next].toLowerCase()}`}
      title={labels[current]}
      onClick={() => setTheme(next)}
    >
      <Icon />
    </Button>
  )
}
