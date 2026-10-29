import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { getCurrentUser } from '@/lib/auth'
import { readUsers, toPublic } from '@/lib/users'
import { AddMemberForm, ChangePasswordForm, MembersTable } from './settings-view'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const me = await getCurrentUser()
  if (!me) redirect('/login?next=/settings')
  const members = me.role === 'admin' ? (await readUsers()).map(toPublic) : []

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Settings"
        description={
          me.role === 'admin'
            ? 'Add committee members who can make changes. Everyone else sees the app read-only.'
            : 'Your account. Ask an admin to change your role.'
        }
      />

      {me.role === 'admin' && (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Members with edit access</h2>
            <p className="text-sm text-muted-foreground">
              Admins manage members and settings. Editors can update notices, requests, visitors, bills and accounts.
            </p>
          </div>
          <MembersTable members={members} meId={me.id} />
          <AddMemberForm />
        </section>
      )}

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Your account</h2>
          <p className="text-sm text-muted-foreground">
            {me.name} · {me.email} · <span className="capitalize">{me.role}</span>
          </p>
        </div>
        <ChangePasswordForm />
      </section>
    </div>
  )
}
