'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, setupAdmin } from '@/app/actions/auth'

function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  )
}

function Field({ id, label, ...props }: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} required {...props} />
    </div>
  )
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined)
  return (
    <Card>
      <CardContent className="p-5">
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <Field id="email" label="Email" type="email" autoComplete="email" />
          <Field id="password" label="Password" type="password" autoComplete="current-password" />
          <FormError message={state?.error} />
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="animate-spin" data-icon="inline-start" />}
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function SetupForm() {
  const [state, action, pending] = useActionState(setupAdmin, undefined)
  return (
    <Card>
      <CardContent className="p-5">
        <form action={action} className="flex flex-col gap-4">
          <Field id="setupCode" label="Setup code" autoComplete="off" />
          <Field id="name" label="Your name" autoComplete="name" />
          <Field id="email" label="Email" type="email" autoComplete="email" />
          <Field id="password" label="Password (8+ characters)" type="password" minLength={8} autoComplete="new-password" />
          <FormError message={state?.error} />
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="animate-spin" data-icon="inline-start" />}
            Create admin account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
