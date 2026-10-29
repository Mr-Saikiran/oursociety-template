import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { readUsers } from '@/lib/users'
import { LoginForm, SetupForm } from './forms'
import { society } from '@/lib/data'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentUser()) redirect('/')
  const { next } = await searchParams
  const needsSetup = (await readUsers()).length === 0

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-6 sm:py-12">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{needsSetup ? `Set up ${society.appName}` : 'Sign in'}</h1>
        <p className="text-sm text-muted-foreground">
          {needsSetup
            ? 'Create the first admin account. You will need the setup code.'
            : 'Committee members sign in to make changes. Everyone else can browse without signing in.'}
        </p>
      </div>
      {needsSetup ? <SetupForm /> : <LoginForm next={next ?? '/'} />}
    </div>
  )
}
