import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { getCurrentUser } from '@/lib/auth'
import { readUsers, toPublic } from '@/lib/users'
import { STATIC_DEMO } from '@/lib/static'
import { DemoNotice } from '@/components/demo-notice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddMemberForm, ChangePasswordForm, MembersTable } from './settings-view'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  if (STATIC_DEMO) return <DemoNotice />
  const me = await getCurrentUser()
  if (!me) redirect('/login?next=/settings')
  const members = me.role === 'admin' ? (await readUsers()).map(toPublic) : []

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Settings"
        description={
          me.role === 'admin'
            ? 'Add committee members who can make changes. Everyone else sees the app read-only.'
            : 'Your account. Ask an admin to change your role.'
        }
      />

      <div className="flex flex-col gap-6">
        {me.role === 'admin' && (
          <Card>
            <CardHeader className="gap-1.5">
              <CardTitle className="text-xl"><h2>Members with edit access</h2></CardTitle>
              <CardDescription className="max-w-prose text-[0.9375rem] leading-relaxed">
                Admins manage members and settings. Editors can update notices, requests, visitors, bills and accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <MembersTable members={members} meId={me.id} />
              <AddMemberForm />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl"><h2>Your account</h2></CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-tone-mint text-base font-extrabold text-tone-mint-ink" aria-hidden>
                {me.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-lg font-bold leading-snug">
                  {me.name}
                  <Badge variant="sky" className="capitalize">{me.role}</Badge>
                </p>
                <p className="truncate text-[0.9375rem] text-muted-foreground">{me.email}</p>
              </div>
            </div>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
