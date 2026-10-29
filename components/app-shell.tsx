'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navGroups, navItems, mobilePrimaryHrefs } from '@/lib/nav'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchDialog } from '@/components/search-dialog'
import { Notifications } from '@/components/notifications'
import { UserMenu } from '@/components/user-menu'
import { useSession } from '@/components/session-provider'
import type { LiveData } from '@/lib/live'
import { society } from '@/society/config'
import { asset, STATIC_DEMO } from '@/lib/static'

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-6">
      {navGroups.map((group) => (
        <div key={group} className="flex flex-col gap-0.5">
          <p className="px-3.5 pb-1.5 text-sm font-bold text-sidebar-foreground/65">
            {group}
          </p>
          {navItems
            .filter((item) => item.group === group)
            .map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-full px-3.5 py-2.5 text-[0.9375rem] font-bold transition-colors duration-120 ease-out',
                    active
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_3px_0_var(--primary-edge)]'
                      : 'text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                  )}
                >
                  <Icon className={cn('size-5 shrink-0', active ? 'text-accent' : 'text-primary')} />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
        </div>
      ))}
    </nav>
  )
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image src={asset(society.logo)} alt="" width={44} height={44} className="size-11 shrink-0 rounded-2xl" priority />
      {!compact && (
        <div className="min-w-0 leading-tight">
          <p className="truncate text-lg font-extrabold tracking-tight text-sidebar-foreground">{society.appName}</p>
          <p className="truncate text-xs text-sidebar-foreground/70">
            {society.shortName}, Reg {society.regNo}
          </p>
        </div>
      )}
    </div>
  )
}

function SidebarFooter() {
  const user = useSession()
  const pathname = usePathname()
  if (user) {
    return (
      <Link
        href="/settings"
        className={cn(
          'flex items-center gap-3 rounded-full px-3.5 py-2.5 text-[0.9375rem] font-bold transition-colors duration-120 ease-out',
          pathname === '/settings'
            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
            : 'text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-foreground',
        )}
      >
        <Settings className="size-5 shrink-0 text-primary" />
        Settings
      </Link>
    )
  }
  return (
    <div className="rounded-3xl bg-tone-sun p-4 text-sm text-tone-sun-ink">
      <p className="font-extrabold">{STATIC_DEMO ? 'Read-only demo' : 'Read-only view'}</p>
      <p className="mt-1">
        {STATIC_DEMO ? 'Sample data for a made-up community.' : 'Committee members can sign in to make changes.'}
      </p>
    </div>
  )
}

function currentTitle(pathname: string) {
  if (pathname === '/settings') return 'Settings'
  if (pathname === '/login') return 'Sign in'
  return navItems.find((i) => i.href === pathname)?.label ?? society.appName
}

export function AppShell({ children, live }: { children: React.ReactNode; live: LiveData }) {
  const pathname = usePathname()
  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[18rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-7 border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Link href="/" className="px-2">
          <Brand />
        </Link>
        <ScrollArea className="-mx-1 min-h-0 flex-1 px-1">
          <NavLinks />
        </ScrollArea>
        <SidebarFooter />
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-background px-4 lg:px-10">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu />
                  </Button>
                }
              />
              <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <ScrollArea className="h-full">
                  <div className="flex flex-col gap-6 px-3 py-5">
                    <div className="px-2"><Brand /></div>
                    <NavLinks />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex min-w-0 items-center gap-2.5 lg:hidden">
            <Image src={asset(society.logo)} alt="" width={32} height={32} className="size-8 shrink-0 rounded-lg" />
            <span className="truncate text-base font-bold tracking-tight">{society.appName}</span>
          </div>

          <p className="hidden text-sm text-muted-foreground lg:block">
            {society.shortName} <span className="px-1.5">/</span>
            <span className="font-bold text-foreground">{currentTitle(pathname)}</span>
          </p>

          <div className="ml-auto flex items-center gap-1">
            <SearchDialog live={live} />
            <ThemeToggle />
            <Notifications live={live} />
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 lg:px-10 lg:pt-8 lg:pb-16">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileTabBar />
    </div>
  )
}

function MobileTabBar() {
  const pathname = usePathname()
  const primary = mobilePrimaryHrefs.map((h) => navItems.find((i) => i.href === h)!)
  const rest = navItems.filter((i) => !mobilePrimaryHrefs.includes(i.href))
  const moreActive = rest.some((i) => i.href === pathname)
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-3xl border border-border bg-card/95 p-1.5 shadow-lg backdrop-blur-xl lg:hidden">
      {primary.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-2xl py-2 text-xs font-semibold transition-colors duration-120 ease-out',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
            )}
          >
            <Icon className="size-5" />
            {item.short}
          </Link>
        )
      })}
      <Sheet>
        <SheetTrigger
          render={
            <button
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-2xl py-2 text-xs font-semibold',
                moreActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
              )}
              aria-label="More sections"
            >
              <Menu className="size-5" />
              More
            </button>
          }
        />
        <SheetContent side="bottom" className="max-h-[80dvh] rounded-t-3xl">
          <SheetTitle className="mb-2 px-1 text-base">All sections</SheetTitle>
          <ScrollArea className="max-h-[65dvh]">
            <div className="grid grid-cols-3 gap-2.5 pb-6">
              {rest.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center text-xs font-semibold transition-colors',
                      active ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-card hover:bg-muted',
                    )}
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    {item.short}
                  </Link>
                )
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
