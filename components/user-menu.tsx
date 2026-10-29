'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LogIn, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSession } from '@/components/session-provider'
import { logout } from '@/app/actions/auth'

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('')

export function UserMenu() {
  const user = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (!user) {
    return (
      <Button
        size="sm"
        className="ml-1"
        nativeButton={false}
        render={<Link href={pathname === '/login' ? '/login' : `/login?next=${encodeURIComponent(pathname)}`} />}
      >
        <LogIn data-icon="inline-start" />
        Sign in
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label={`Account: ${user.name}`}
            className="ml-1 flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {initials(user.name)}
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="truncate font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs font-normal">{user.email} · <span className="capitalize">{user.role}</span></p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
