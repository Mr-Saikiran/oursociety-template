'use client'

import { usePathname } from 'next/navigation'
import { navItems, type NavGroup } from '@/lib/nav'
import { cn } from '@/lib/utils'

/* Each nav group carries one tone, so a resident learns where they are by colour. */
const groupTone: Record<NavGroup, string> = {
  Overview: 'bg-tone-coral text-tone-coral-ink',
  Money: 'bg-tone-sun text-tone-sun-ink',
  Community: 'bg-tone-mint text-tone-mint-ink',
  Living: 'bg-tone-sky text-tone-sky-ink',
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  const pathname = usePathname()
  const item = navItems.find((i) => i.href === pathname)
  const Icon = item?.icon
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-5 rounded-[2rem] px-6 py-7 sm:flex-row sm:items-end sm:justify-between lg:px-10 lg:py-10',
        item ? groupTone[item.group] : 'bg-muted text-foreground',
      )}
    >
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {Icon && (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-card/80 lg:size-16" aria-hidden>
            <Icon className="size-7 lg:size-8" />
          </span>
        )}
        <div className="min-w-0 max-w-2xl">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground lg:text-[2.75rem] lg:leading-[1.05]">
            {title}
          </h1>
          {description && <p className="mt-2 text-base leading-relaxed lg:text-lg">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
