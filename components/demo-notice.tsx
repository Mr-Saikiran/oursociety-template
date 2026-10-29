import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { society } from '@/society/config'

/** Replaces sign-in and settings in the static demo, which has no accounts. */
export function DemoNotice() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Lock className="size-5" />
      </span>
      <h1 className="text-2xl font-bold tracking-tight">This is a read-only demo</h1>
      <p className="text-sm text-muted-foreground">
        {society.appName} is open source. Deploy your own copy to sign in, add committee members and keep your
        society&apos;s records up to date.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button nativeButton={false} render={<a href="https://github.com/Mr-Saikiran/oursociety-template" target="_blank" rel="noopener noreferrer" />}>
          Get the code
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
          Back to dashboard
        </Button>
      </div>
    </div>
  )
}
