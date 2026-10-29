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

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-5">
      {navGroups.map((group) => (
        <div key={group} className="flex flex-col gap-0.5">
          <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-sidebar-foreground/45 uppercase">
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
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                  )}
                >
                  {active && (
                    <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" aria-hidden />
                  )}
                  <Icon className={cn('size-[18px] shrink-0', active && 'text-sidebar-primary')} />
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
      <Image src={society.logo} alt="" width={40} height={40} className="size-10 shrink-0 rounded-xl" priority />
      {!compact && (
        <div className="min-w-0 leading-tight">
          <p className="truncate text-base font-bold tracking-tight text-sidebar-foreground">{society.appName}</p>
          <p className="truncate text-xs text-sidebar-foreground/60">
            {society.shortName} · Reg {society.regNo}
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
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          pathname === '/settings'
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
        )}
      >
        <Settings className="size-[18px] shrink-0" />
        Settings
      </Link>
    )
  }
  return (
    <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3 text-xs text-sidebar-foreground/70">
      <p className="font-medium text-sidebar-foreground">Read-only view</p>
      <p className="mt-1">Committee members can sign in to make changes.</p>
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
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-sidebar-border bg-sidebar px-3 py-5 lg:flex">
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
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl backdrop-saturate-150 lg:px-8">
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
            <Image src={society.logo} alt="" width={32} height={32} className="size-8 shrink-0 rounded-lg" />
            <span className="truncate text-base font-bold tracking-tight">{society.appName}</span>
          </div>

          <p className="hidden text-sm text-muted-foreground lg:block">
            {society.shortName} <span className="px-1.5 text-border">/</span>
            <span className="font-medium text-foreground">{currentTitle(pathname)}</span>
          </p>

          <div className="ml-auto flex items-center gap-1">
            <SearchDialog live={live} />
            <ThemeToggle />
            <Notifications live={live} />
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 lg:px-8 lg:pt-8 lg:pb-12">{children}</main>
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
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-2xl border border-border/70 bg-background/80 p-1 shadow-lg backdrop-blur-xl backdrop-saturate-150 lg:hidden">
      {primary.map((item) => {
        const active = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium transition-colors',
              active ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
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
                'flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium',
                moreActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
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
                      'flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center text-xs font-medium transition-colors',
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
