'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lock } from 'lucide-react'

/** Shown in place of edit controls to visitors who are not signed in. */
export function ReadOnlyNote({ action }: { action: string }) {
  const pathname = usePathname()
  return (
    <p className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
      <Lock className="size-3.5 shrink-0" aria-hidden />
      <span>
        Read-only.{' '}
        <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>{' '}
        to {action}.
      </span>
    </p>
  )
}
