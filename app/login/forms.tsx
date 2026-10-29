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
    <p role="alert" className="rounded-2xl bg-tone-coral px-4 py-3 text-sm font-semibold text-tone-coral-ink">
      {message}
    </p>
  )
}

function Field({ id, label, ...props }: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} required {...props} />
    </div>
  )
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined)
  return (
    <Card className="py-0">
      <CardContent className="p-6 sm:p-8">
        <form action={action} className="flex flex-col gap-5">
          <input type="hidden" name="next" value={next} />
          <Field id="email" label="Email" type="email" autoComplete="email" />
          <Field id="password" label="Password" type="password" autoComplete="current-password" />
          <FormError message={state?.error} />
          <Button type="submit" size="lg" className="mt-1 w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" disabled={pending}>
            {pending && <Loader2 className="animate-spin motion-reduce:animate-none" data-icon="inline-start" />}
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
    <Card className="py-0">
      <CardContent className="p-6 sm:p-8">
        <form action={action} className="flex flex-col gap-5">
          <div className="rounded-2xl bg-muted p-4">
            <Field id="setupCode" label="Setup code" autoComplete="off" />
          </div>
          <Field id="name" label="Your name" autoComplete="name" />
          <Field id="email" label="Email" type="email" autoComplete="email" />
          <Field id="password" label="Password (8+ characters)" type="password" minLength={8} autoComplete="new-password" />
          <FormError message={state?.error} />
          <Button type="submit" size="lg" className="mt-1 w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" disabled={pending}>
            {pending && <Loader2 className="animate-spin motion-reduce:animate-none" data-icon="inline-start" />}
            Create admin account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
