'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2, Trash2, UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { addMember, changePassword, removeMember, updateRole, type FormState } from '@/app/actions/auth'
import type { PublicUser, Role } from '@/lib/users'

const roleItems = [
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
]

function useToastResult(state: FormState) {
  useEffect(() => {
    if (state?.ok) toast.success(state.ok)
  }, [state])
}

export function MembersTable({ members, meId }: { members: PublicUser[]; meId: string }) {
  const [pending, start] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  function run(id: string, fn: () => Promise<FormState>) {
    setBusyId(id)
    start(async () => {
      const res = await fn()
      if (res?.error) toast.error(res.error)
      else if (res?.ok) toast.success(res.ok)
      setBusyId(null)
    })
  }

  return (
    <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-12"><span className="sr-only">Remove</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => {
              const isMe = m.id === meId
              const busy = pending && busyId === m.id
              return (
                <TableRow key={m.id}>
                  <TableCell>
                    <p className="flex flex-wrap items-center gap-2 text-[0.9375rem] font-bold">{m.name} {isMe && <Badge variant="mint">You</Badge>}</p>
                    <p className="text-sm text-muted-foreground sm:hidden">{m.email}</p>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">{m.email}</TableCell>
                  <TableCell>
                    <Select
                      items={roleItems}
                      value={m.role}
                      disabled={isMe || busy}
                      onValueChange={(v) => run(m.id, () => updateRole(m.id, v as Role))}
                    >
                      <SelectTrigger size="sm" className="w-32" aria-label={`Role for ${m.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleItems.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {!isMe && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${m.name}`}
                        disabled={busy}
                        onClick={() => {
                          if (confirm(`Remove ${m.name}? They will no longer be able to sign in.`)) run(m.id, () => removeMember(m.id))
                        }}
                      >
                        {busy ? <Loader2 className="animate-spin motion-reduce:animate-none" /> : <Trash2 />}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
    </div>
  )
}

export function AddMemberForm() {
  const [state, action, pending] = useActionState(addMember, undefined)
  const [role, setRole] = useState<Role>('editor')
  const formRef = useRef<HTMLFormElement>(null)
  useToastResult(state)
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset()
      setRole('editor')
    }
  }, [state])

  return (
    <div className="rounded-3xl bg-muted p-5 sm:p-6">
        <form ref={formRef} action={action} className="flex flex-col gap-5">
          <p className="flex items-center gap-3 text-lg font-bold">
            <span className="flex size-10 items-center justify-center rounded-full bg-tone-mint text-tone-mint-ink" aria-hidden><UserPlus className="size-5" /></span>
            Add a member
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2"><Label htmlFor="m-name">Name</Label><Input id="m-name" name="name" required /></div>
            <div className="flex flex-col gap-2"><Label htmlFor="m-email">Email</Label><Input id="m-email" name="email" type="email" required /></div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <input type="hidden" name="role" value={role} />
              <Select items={roleItems} value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{roleItems.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="m-password">Temporary password</Label>
              <Input id="m-password" name="password" type="password" minLength={8} required autoComplete="new-password" />
            </div>
          </div>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">Share the temporary password with them privately. They can change it in Settings after signing in.</p>
          {state?.error && <p role="alert" className="rounded-2xl bg-tone-coral px-4 py-3 text-sm font-semibold text-tone-coral-ink">{state.error}</p>}
          <div>
            <Button type="submit" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" disabled={pending}>
              {pending && <Loader2 className="animate-spin motion-reduce:animate-none" data-icon="inline-start" />}
              Add member
            </Button>
          </div>
        </form>
    </div>
  )
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined)
  const formRef = useRef<HTMLFormElement>(null)
  useToastResult(state)
  useEffect(() => {
    if (state?.ok) formRef.current?.reset()
  }, [state])

  return (
    <div className="rounded-3xl bg-muted p-5 sm:p-6">
        <form ref={formRef} action={action} className="flex flex-col gap-5 sm:max-w-sm">
          <p className="text-lg font-bold">Change password</p>
          <div className="flex flex-col gap-2"><Label htmlFor="pw-current">Current password</Label><Input id="pw-current" name="current" type="password" required autoComplete="current-password" /></div>
          <div className="flex flex-col gap-2"><Label htmlFor="pw-next">New password</Label><Input id="pw-next" name="next" type="password" minLength={8} required autoComplete="new-password" /></div>
          {state?.error && <p role="alert" className="rounded-2xl bg-tone-coral px-4 py-3 text-sm font-semibold text-tone-coral-ink">{state.error}</p>}
          <div>
            <Button type="submit" variant="outline" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" disabled={pending}>
              {pending && <Loader2 className="animate-spin motion-reduce:animate-none" data-icon="inline-start" />}
              Update password
            </Button>
          </div>
        </form>
    </div>
  )
}
