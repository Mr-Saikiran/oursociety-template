import Link from 'next/link'
import {
  ReceiptIndianRupee,
  Landmark,
  CalendarClock,
  Wrench,
  ArrowRight,
  TrendingUp,
  Megaphone,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
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
      icon: ReceiptIndianRupee,
      href: '/maintenance',
    },
    {
      label: 'Outstanding dues',
      value: moneyShort(maintenanceSummary.outstanding),
      hint: `${maintenanceSummary.duePlots} ${society.terms.units} pending`,
      icon: TrendingUp,
      href: '/maintenance',
    },
    {
      label: 'Funds in hand',
      value: moneyShort(audit.closingBalance),
      hint: 'As per latest audit',
      icon: Landmark,
      href: '/finances',
    },
    {
      label: 'Open requests',
      value: String(openRequests.length),
      hint: `${serviceRequests.length} total`,
      icon: Wrench,
      href: '/requests',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`Welcome to ${society.shortName}`}
        description={`${society.name} (${society.acronym}) · Reg. No. ${society.regNo} · ${society.location}. Serving ${society.totalPlots} homes across ${society.roads.length} ${society.terms.blocks}.`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.label} href={s.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-3 p-4 lg:p-5">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="size-[18px]" />
                  </div>
                  <div>
                    <p className="font-serif text-xl font-semibold lg:text-2xl">{s.value}</p>
                    <p className="mt-0.5 text-xs font-medium text-foreground">{s.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.hint}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-3">
        {/* Announcements */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="size-4 text-primary" />
              <CardTitle>Announcements</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-xl border border-border bg-secondary/40 p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <Badge variant="secondary">{a.tag}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.date).toLocaleDateString(society.locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="font-medium">{a.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {/* Collection progress */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance drive</CardTitle>
              <CardDescription>{society.maintenanceYear} collection status</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-serif text-2xl font-semibold">{paidPct}%</span>
                  <span className="text-xs text-muted-foreground">
                    {maintenanceSummary.paidPlots}/{maintenanceSummary.totalPlots} {society.terms.units}
                  </span>
                </div>
                <Progress value={paidPct} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-secondary/60 p-2">
                  <p className="font-serif text-lg font-semibold text-primary">{maintenanceSummary.paidPlots}</p>
                  <p className="text-xs text-muted-foreground">Paid</p>
                </div>
                <div className="rounded-lg bg-secondary/60 p-2">
                  <p className="font-serif text-lg font-semibold">{maintenanceSummary.partialPlots}</p>
                  <p className="text-xs text-muted-foreground">Partial</p>
                </div>
                <div className="rounded-lg bg-secondary/60 p-2">
                  <p className="font-serif text-lg font-semibold text-destructive">{maintenanceSummary.duePlots}</p>
                  <p className="text-xs text-muted-foreground">Due</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" nativeButton={false} render={<Link href="/maintenance" />}>
                View members list
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming meeting */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarClock className="size-4 text-primary" />
                <CardTitle>Upcoming meeting</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {upcoming[0] ? (
                <Link href="/meetings" className="block rounded-xl border border-border p-4 transition-colors hover:bg-secondary/50">
                  <Badge variant="secondary">{upcoming[0].type}</Badge>
                  <p className="mt-2 font-medium leading-snug">{upcoming[0].title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(upcoming[0].date).toLocaleDateString(society.locale, { weekday: 'long', day: 'numeric', month: 'long' })} · {upcoming[0].time}
                  </p>
                  <p className="text-sm text-muted-foreground">{upcoming[0].venue}</p>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming meetings scheduled.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
