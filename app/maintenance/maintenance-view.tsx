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
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { maintenanceSummary, money, moneyShort, type MaintenanceRecord } from '@/lib/data'
import { useCanEdit } from '@/components/session-provider'
import { RecordPayment } from './record-payment'
import { society } from '@/society/config'

const statusMeta = {
  paid: { label: 'Paid', variant: 'secondary' as const, icon: CheckCircle2, className: 'text-primary' },
  partial: { label: 'Partial', variant: 'outline' as const, icon: Clock3, className: 'text-accent-foreground' },
  due: { label: 'Due', variant: 'outline' as const, icon: AlertCircle, className: 'text-destructive' },
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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summaryCards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <p className={`font-serif text-xl font-semibold ${c.tone}`}>{c.value}</p>
              <p className="mt-0.5 text-xs font-medium">{c.label}</p>
              <p className="text-xs text-muted-foreground">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="sm:max-w-xs">
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
          className="w-full sm:w-auto"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="paid">Paid</ToggleGroupItem>
          <ToggleGroupItem value="partial">Partial</ToggleGroupItem>
          <ToggleGroupItem value="due">Due</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {rows.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No records found</EmptyTitle>
            <EmptyDescription>Try a different search term or filter.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-hidden p-0 sm:block">
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
          </Card>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {rows.map((r) => {
              const meta = statusMeta[r.status]
              const Icon = meta.icon
              return (
                <Card key={`${r.road}-${r.plotNo}`}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Avatar className="size-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initials(r.owner)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.owner}</p>
                      <p className="text-xs text-muted-foreground">{society.terms.unit} {r.plotNo} · {society.terms.block} {r.road}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <Badge variant={meta.variant} className={`gap-1 ${meta.className}`}>
                        <Icon className="size-3" />{meta.label}
                      </Badge>
                      {r.dueAmount > 0 && (
                        <p className="mt-1 text-xs font-medium text-destructive">{money(r.dueAmount)} due</p>
                      )}
                    </div>
                  </CardContent>
                  {canEdit && r.dueAmount > 0 && <div className="px-4 pb-4"><RecordPayment record={r} /></div>}
                </Card>
              )
            })}
          </div>
        </>
      )}
      <p className="text-center text-xs text-muted-foreground">
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
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials(r.owner)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{r.owner}</span>
        </div>
      </TableCell>
      <TableCell>{r.plotNo}</TableCell>
      <TableCell>{r.road}</TableCell>
      <TableCell>
        <Badge variant={meta.variant} className={`gap-1 ${meta.className}`}>
          <Icon className="size-3" />{meta.label}
        </Badge>
      </TableCell>
      <TableCell className="text-right tabular-nums">{r.paidAmount ? money(r.paidAmount) : '—'}</TableCell>
      <TableCell className="text-right tabular-nums">
        {r.dueAmount ? <span className="font-medium text-destructive">{money(r.dueAmount)}</span> : '—'}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {r.lastPaid ? new Date(r.lastPaid).toLocaleDateString(society.locale, { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
      </TableCell>
      {canEdit && <TableCell className="text-right">{r.dueAmount > 0 && <RecordPayment record={r} />}</TableCell>}
    </TableRow>
  )
}
