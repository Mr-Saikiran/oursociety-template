'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lock } from 'lucide-react'
import { STATIC_DEMO } from '@/lib/static'

/** Shown in place of edit controls to visitors who are not signed in. */
export function ReadOnlyNote({ action }: { action: string }) {
  const pathname = usePathname()
  if (STATIC_DEMO) {
    return (
      <p className="flex items-center gap-2 rounded-full bg-tone-sun px-4 py-2 text-sm font-semibold text-tone-sun-ink">
        <Lock className="size-3.5 shrink-0" aria-hidden />
        <span>Read-only demo. Deploy your own copy to {action}.</span>
      </p>
    )
  }
  return (
    <p className="flex items-center gap-2 rounded-full bg-tone-sun px-4 py-2 text-sm font-semibold text-tone-sun-ink">
      <Lock className="size-3.5 shrink-0" aria-hidden />
      <span>
        Read-only.{' '}
        <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="font-bold text-tone-sun-ink underline underline-offset-4 hover:no-underline">
          Sign in
        </Link>{' '}
        to {action}.
      </span>
    </p>
  )
}
