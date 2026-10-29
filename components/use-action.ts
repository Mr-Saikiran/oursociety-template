'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import type { ActionResult } from '@/app/actions/data'

/**
 * Runs a server action in a transition and toasts its result.
 * `onSuccess` runs only when the action reports ok (e.g. to close a dialog).
 * The page re-renders with fresh data because the action revalidates it.
 */
export function useAction() {
  const [pending, start] = useTransition()
  const run = (action: () => Promise<ActionResult>, onSuccess?: () => void) =>
    start(async () => {
      const res = await action()
      if (res.error) toast.error(res.error)
      else {
        if (res.ok) toast.success(res.ok)
        onSuccess?.()
      }
    })
  return { pending, run }
}
