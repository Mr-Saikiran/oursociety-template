'use client'

import { useMemo, useState } from 'react'
import { Search, CheckCircle2, AlertCircle, Clock3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { maintenanceSummary, money, moneyShort, type MaintenanceRecord } from '@/lib/data'
import { useCanEdit } from '@/components/session-provider'
import { RecordPayment } from './record-payment'
import { society } from '@/society/config'

const statusMeta = {
  paid: { label: 'Paid', variant: 'mint' as const, icon: CheckCircle2, className: '' },
  partial: { label: 'Partial', variant: 'sun' as const, icon: Clock3, className: '' },
  due: { label: 'Due', variant: 'coral' as const, icon: AlertCircle, className: '' },
}

const avatarTone = {
  paid: 'bg-tone-mint text-tone-mint-ink',
  partial: 'bg-tone-sun text-tone-sun-ink',
  due: 'bg-tone-coral text-tone-coral-ink',
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export function MaintenanceView({ records }: { records: MaintenanceRecord[] }) {
  const canEdit = useCanEdit()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')

  const rows = useMemo(() => {
    return records.filter((r) => {
      const matchesQ =
        !q ||
        r.owner.toLowerCase().includes(q.toLowerCase()) ||
        r.plotNo.includes(q) ||
        r.road.toLowerCase().includes(q.toLowerCase())
      const matchesFilter = filter === 'all' || r.status === filter
      return matchesQ && matchesFilter
    })
  }, [q, filter])

  const summaryCards = [
    { label: `Collected ${society.maintenanceYear}`, value: moneyShort(maintenanceSummary.collected), sub: `${maintenanceSummary.paidPlots} paid + ${maintenanceSummary.partialPlots} partial`, tone: 'text-primary' },
    { label: 'Outstanding dues', value: moneyShort(maintenanceSummary.outstanding), sub: `${maintenanceSummary.duePlots} ${society.terms.units} pending`, tone: 'text-destructive' },
    { label: `Rate per ${society.terms.unit.toLowerCase()}`, value: money(maintenanceSummary.ratePerPlot), sub: `Annual, per ${society.maintenanceApprovedAt}`, tone: '' },
    { label: `Total ${society.terms.units}`, value: String(maintenanceSummary.totalPlots), sub: `Across ${society.roads.length} ${society.terms.blocks}`, tone: '' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Key figures: one card, parted by hairlines */}
      <Card className="py-0">
        <CardContent className="grid grid-cols-2 p-0 lg:grid-cols-4">
          {summaryCards.map((c, i) => (
            <div
              key={c.label}
              className={`flex flex-col gap-1 p-5 lg:p-6 ${i > 0 ? 'lg:border-l lg:border-border' : ''} ${
                i % 2 === 1 ? 'border-l border-border' : ''
              } ${i > 1 ? 'border-t border-border lg:border-t-0' : ''}`}
            >
              <p className="text-sm font-semibold text-muted-foreground">{c.label}</p>
              <p className={`tabular text-3xl font-extrabold tracking-tight lg:text-4xl ${c.tone || 'text-foreground'}`}>{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.sub}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="sm:max-w-sm">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={`Search owner, ${society.terms.unit.toLowerCase()} or ${society.terms.block.toLowerCase()}…`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </InputGroup>
        <ToggleGroup
          value={[filter]}
          onValueChange={(v) => v.length > 0 && setFilter(v[0])}
          className="w-full gap-1 rounded-full bg-muted p-1 sm:w-auto"
        >
          <ToggleGroupItem value="all" className="flex-1 rounded-full px-4 font-semibold focus-visible:ring-ring sm:flex-none">All</ToggleGroupItem>
          <ToggleGroupItem value="paid" className="flex-1 rounded-full px-4 font-semibold focus-visible:ring-ring sm:flex-none">Paid</ToggleGroupItem>
          <ToggleGroupItem value="partial" className="flex-1 rounded-full px-4 font-semibold focus-visible:ring-ring sm:flex-none">Partial</ToggleGroupItem>
          <ToggleGroupItem value="due" className="flex-1 rounded-full px-4 font-semibold focus-visible:ring-ring sm:flex-none">Due</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {rows.length === 0 ? (
        <Card>
          <Empty className="py-10">
            <EmptyHeader>
              <EmptyMedia className="size-14 rounded-full bg-tone-sky text-tone-sky-ink">
                <Search className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-lg font-bold">No records found</EmptyTitle>
              <EmptyDescription className="text-[0.9375rem]">Try a different search term or filter.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-hidden p-0 sm:block">
            <CardContent className="p-2 sm:p-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Owner</TableHead>
                    <TableHead>{society.terms.unit}</TableHead>
                    <TableHead>{society.terms.block}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                    <TableHead>Last paid</TableHead>
                    {canEdit && <TableHead><span className="sr-only">Actions</span></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <MemberRow key={`${r.road}-${r.plotNo}`} r={r} canEdit={canEdit} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mobile list */}
          <Card className="sm:hidden">
            <CardContent>
              <ul className="divide-y divide-border">
                {rows.map((r) => {
                  const meta = statusMeta[r.status]
                  const Icon = meta.icon
                  return (
                    <li key={`${r.road}-${r.plotNo}`} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-11 shrink-0">
                          <AvatarFallback className={`text-sm font-bold ${avatarTone[r.status]}`}>
                            {initials(r.owner)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-bold">{r.owner}</p>
                          <p className="text-sm text-muted-foreground">
                            {society.terms.unit} {r.plotNo}, {society.terms.block} {r.road}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <Badge variant={meta.variant} className={`gap-1 ${meta.className}`}>
                            <Icon className="size-3" />{meta.label}
                          </Badge>
                          {r.dueAmount > 0 && (
                            <p className="tabular mt-1 text-base font-extrabold text-destructive">{money(r.dueAmount)} due</p>
                          )}
                        </div>
                      </div>
                      {canEdit && r.dueAmount > 0 && <RecordPayment record={r} />}
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
      <p className="text-center text-sm text-muted-foreground">
        Showing {rows.length} of {records.length} records. Full ledger of {maintenanceSummary.totalPlots} {society.terms.units} is maintained by the Treasurer.
      </p>
    </div>
  )
}

function MemberRow({ r, canEdit }: { r: MaintenanceRecord; canEdit: boolean }) {
  const meta = statusMeta[r.status]
  const Icon = meta.icon
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className={`text-xs font-bold ${avatarTone[r.status]}`}>
              {initials(r.owner)}
            </AvatarFallback>
          </Avatar>
          <span className="font-bold">{r.owner}</span>
        </div>
      </TableCell>
      <TableCell className="tabular font-semibold">{r.plotNo}</TableCell>
      <TableCell>{r.road}</TableCell>
      <TableCell>
        <Badge variant={meta.variant} className={`gap-1 ${meta.className}`}>
          <Icon className="size-3" />{meta.label}
        </Badge>
      </TableCell>
      <TableCell className="tabular text-right text-base font-bold">
        {r.paidAmount ? money(r.paidAmount) : <span className="font-normal text-muted-foreground">Nil</span>}
      </TableCell>
      <TableCell className="tabular text-right text-base">
        {r.dueAmount ? <span className="font-extrabold text-destructive">{money(r.dueAmount)}</span> : <span className="text-muted-foreground">Nil</span>}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {r.lastPaid ? new Date(r.lastPaid).toLocaleDateString(society.locale, { day: 'numeric', month: 'short', year: '2-digit' }) : 'Not yet'}
      </TableCell>
      {canEdit && <TableCell className="text-right">{r.dueAmount > 0 && <RecordPayment record={r} />}</TableCell>}
    </TableRow>
  )
}
