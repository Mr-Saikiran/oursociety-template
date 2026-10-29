import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { readUsers } from '@/lib/users'
import { LoginForm, SetupForm } from './forms'
import { society } from '@/lib/data'
import { STATIC_DEMO } from '@/lib/static'
import { DemoNotice } from '@/components/demo-notice'
import { KeyRound, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (STATIC_DEMO) return <DemoNotice />
  if (await getCurrentUser()) redirect('/')
  const { next } = await searchParams
  const needsSetup = (await readUsers()).length === 0

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 py-6 sm:py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-tone-mint text-tone-mint-ink" aria-hidden>
          {needsSetup ? <ShieldCheck className="size-8" /> : <KeyRound className="size-8" />}
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight">{needsSetup ? `Set up ${society.appName}` : 'Sign in'}</h1>
          <p className="text-balance text-base leading-relaxed text-muted-foreground">
            {needsSetup
              ? 'Create the first admin account. You will need the setup code.'
              : 'Committee members sign in to make changes. Everyone else can browse without signing in.'}
          </p>
        </div>
      </div>
      {needsSetup ? <SetupForm /> : <LoginForm next={next ?? '/'} />}
    </div>
  )
}
