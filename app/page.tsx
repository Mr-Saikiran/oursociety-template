import Link from 'next/link'
import { CalendarClock, ArrowRight, Megaphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  society,
  moneyShort,
  maintenanceSummary,
  meetings,
  financialStatements,
} from '@/lib/data'
import { all } from '@/lib/repo'

export default async function DashboardPage() {
  const [serviceRequests, notices] = await Promise.all([all('requests'), all('notices')])
  const announcements = [...notices]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4)
    .map((n) => ({ id: n.id, date: n.date, title: n.title, body: n.body, tag: n.category }))
  const upcoming = meetings.filter((m) => m.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date))
  const openRequests = serviceRequests.filter((r) => r.status !== 'resolved')
  const paidPct = Math.round((maintenanceSummary.paidPlots / maintenanceSummary.totalPlots) * 100)
  const audit = financialStatements.find((f) => f.category === 'Annual Audit')!

  const stats = [
    {
      label: 'Maintenance collected',
      value: moneyShort(maintenanceSummary.collected),
      hint: `${paidPct}% of ${society.totalPlots} ${society.terms.units} paid`,
      href: '/maintenance',
    },
    {
      label: 'Outstanding dues',
      value: moneyShort(maintenanceSummary.outstanding),
      hint: `${maintenanceSummary.duePlots} ${society.terms.units} pending`,
      href: '/maintenance',
    },
    {
      label: 'Funds in hand',
      value: moneyShort(audit.closingBalance),
      hint: 'As per latest audit',
      href: '/finances',
    },
    {
      label: 'Open requests',
      value: String(openRequests.length),
      hint: `${serviceRequests.length} total`,
      href: '/requests',
    },
  ]

  const next = upcoming[0]
  const nextDate = next ? new Date(next.date) : null

  const tagTone = (tag: string) =>
    tag === 'Urgent' ? 'coral' : tag === 'Event' ? 'sun' : tag === 'Maintenance' ? 'sky' : tag === 'Security' ? 'coral' : 'mint'

  return (
    <div className="mx-auto max-w-6xl">
      {/* Welcome band: who we are, then what is next and how the drive is going */}
      <section className="grid gap-8 rounded-[2rem] bg-welcome px-6 py-8 text-welcome-foreground sm:px-10 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-12 lg:py-12">
        <div className="flex min-w-0 flex-col justify-center">
          <h1 className="text-balance text-4xl font-extrabold tracking-tight lg:text-[3.5rem] lg:leading-[1.02]">
            Welcome to {society.shortName}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-welcome-muted lg:text-lg">
            {`${society.name} (${society.acronym}), Reg. No. ${society.regNo}, ${society.location}. Serving ${society.totalPlots} homes across ${society.roads.length} ${society.terms.blocks}.`}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {next && nextDate ? (
            <Link
              href="/meetings"
              className="flex items-center gap-4 rounded-3xl bg-welcome-foreground p-4 text-foreground transition-transform duration-120 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <span className="tabular text-2xl font-extrabold leading-none">
                  {nextDate.toLocaleDateString(society.locale, { day: 'numeric' })}
                </span>
                <span className="text-xs font-bold">{nextDate.toLocaleDateString(society.locale, { month: 'short' })}</span>
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                  <CalendarClock className="size-4" aria-hidden />
                  Upcoming meeting, {next.type}
                </p>
                <p className="mt-0.5 font-bold leading-snug">{next.title}</p>
                <p className="text-sm text-muted-foreground">
                  {nextDate.toLocaleDateString(society.locale, { weekday: 'long' })}, {next.time}, {next.venue}
                </p>
              </div>
            </Link>
          ) : (
            <p className="rounded-3xl bg-welcome-foreground p-4 text-sm text-muted-foreground">No upcoming meetings scheduled.</p>
          )}
          <Link
            href="/maintenance"
            className="rounded-3xl bg-welcome-foreground p-4 text-foreground transition-transform duration-120 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-muted-foreground">Maintenance drive {society.maintenanceYear}</p>
              <p className="tabular text-2xl font-extrabold text-primary">{paidPct}%</p>
            </div>
            <Progress value={paidPct} className="mt-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {maintenanceSummary.paidPlots}/{maintenanceSummary.totalPlots} {society.terms.units} paid
            </p>
          </Link>
        </div>
      </section>

      {/* Figures: one well, parted by hairlines */}
      <Card className="mt-6 py-0">
        <CardContent className="grid grid-cols-2 p-0 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Link
              key={s.label}
              href={s.href}
              className={`flex flex-col gap-1 p-5 transition-colors duration-120 ease-out hover:bg-muted focus-visible:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring lg:p-6 ${
                i > 0 ? 'lg:border-l lg:border-border' : ''
              } ${i % 2 === 1 ? 'border-l border-border lg:border-l' : ''} ${i > 1 ? 'border-t border-border lg:border-t-0' : ''}`}
            >
              <p className="text-sm font-semibold text-muted-foreground">{s.label}</p>
              <p className="tabular text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.hint}</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        {/* Announcements */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Megaphone className="size-5 text-primary" />
              <CardTitle className="text-xl">Announcements</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {announcements.map((a) => (
                <li key={a.id} className="py-5 first:pt-1 last:pb-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant={tagTone(a.tag)}>{a.tag}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(a.date).toLocaleDateString(society.locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-lg font-bold leading-snug">{a.title}</p>
                  <p className="mt-1 max-w-prose text-[0.9375rem] leading-relaxed text-muted-foreground">{a.body}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Collection breakdown */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-xl">Who has paid</CardTitle>
            <CardDescription>{society.maintenanceYear} collection status</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <dl className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-2xl bg-tone-mint px-4 py-3 text-tone-mint-ink">
                <dt className="font-bold">Paid</dt>
                <dd className="tabular text-2xl font-extrabold">{maintenanceSummary.paidPlots}</dd>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-tone-sun px-4 py-3 text-tone-sun-ink">
                <dt className="font-bold">Partial</dt>
                <dd className="tabular text-2xl font-extrabold">{maintenanceSummary.partialPlots}</dd>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-tone-coral px-4 py-3 text-tone-coral-ink">
                <dt className="font-bold">Due</dt>
                <dd className="tabular text-2xl font-extrabold">{maintenanceSummary.duePlots}</dd>
              </div>
            </dl>
            <Button variant="outline" className="w-full" nativeButton={false} render={<Link href="/maintenance" />}>
              View members list
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
