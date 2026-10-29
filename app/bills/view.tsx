'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Mail, MessageSquare, Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { money, society, type MaintenanceRecord } from '@/lib/data'
import type { BillRun } from '@/lib/repo'
import { recordBillRun } from '@/app/actions/data'
import { useAction } from '@/components/use-action'
import { useCanEdit } from '@/components/session-provider'
import { ReadOnlyNote } from '@/components/read-only-note'

const frequencies = {
  annual: { label: 'Annual (2026–27)', divisor: 1, period: 'FY 2026–27' },
  quarterly: { label: 'Quarterly', divisor: 4, period: 'Q1 Apr–Jun 2026' },
  monthly: { label: 'Monthly', divisor: 12, period: 'April 2026' },
} as const
type Frequency = keyof typeof frequencies

export function BillsView({ records, runs }: { records: MaintenanceRecord[]; runs: BillRun[] }) {
  const canEdit = useCanEdit()
  const { pending, run } = useAction()
  const [freq, setFreq] = useState<Frequency>('annual')
  const [channel, setChannel] = useState<'sms' | 'email' | 'both'>('both')
  const [generated, setGenerated] = useState(false)
  const [sent, setSent] = useState<Set<string>>(new Set())

  const f = frequencies[freq]
  const bills = useMemo(
    () =>
      records.map((r) => {
        const current = Math.round(society.annualMaintenance / f.divisor)
        const arrears = r.dueAmount
        return { ...r, current, arrears, total: current + arrears, billNo: `RA/${freq.slice(0, 1).toUpperCase()}/26-27/${r.plotNo.padStart(3, '0')}` }
      }),
    [f.divisor, freq, records],
  )
  const totalBilled = bills.reduce((s, b) => s + b.total, 0)

  function generate() {
    setGenerated(true)
    setSent(new Set())
    toast.success(`${bills.length} bills generated for ${f.period}`)
  }

  function sendAll() {
    run(
      () =>
        recordBillRun({
          frequency: freq,
          period: f.period,
          channel: channel === 'both' ? 'SMS + email' : channel.toUpperCase(),
          count: bills.length,
          total: totalBilled,
        }),
      () => setSent(new Set(bills.map((b) => b.billNo))),
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {!canEdit && <ReadOnlyNote action="generate and send bills" />}
      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="flex flex-col gap-1.5">
            <Label>Billing frequency</Label>
            <Select items={Object.entries(frequencies).map(([value, v]) => ({ value, label: v.label }))} value={freq} onValueChange={(v) => { setFreq(v as Frequency); setGenerated(false) }}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(frequencies).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Send via</Label>
            <Select items={[{ value: 'both', label: 'SMS and email' }, { value: 'sms', label: 'SMS only' }, { value: 'email', label: 'Email only' }]} value={channel} onValueChange={(v) => setChannel(v as typeof channel)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="both">SMS and email</SelectItem>
                <SelectItem value="sms">SMS only</SelectItem>
                <SelectItem value="email">Email only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={!canEdit}>Generate bills</Button>
        </CardContent>
      </Card>

      {generated && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {bills.length} bills for <span className="font-medium text-foreground">{f.period}</span> · total {money(totalBilled)}
            </p>
            <Button variant="outline" onClick={sendAll} disabled={!canEdit || pending || sent.size === bills.length}>
              {channel === 'email' ? <Mail data-icon="inline-start" /> : channel === 'sms' ? <MessageSquare data-icon="inline-start" /> : <Send data-icon="inline-start" />}
              {sent.size === bills.length ? 'All sent' : 'Send all'}
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill no.</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="hidden sm:table-cell">{society.terms.unit}</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">Arrears</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((b) => (
                    <TableRow key={b.billNo}>
                      <TableCell className="text-xs text-muted-foreground">{b.billNo}</TableCell>
                      <TableCell className="font-medium">{b.owner}</TableCell>
                      <TableCell className="hidden sm:table-cell">{b.plotNo}, {b.road}</TableCell>
                      <TableCell className="text-right">{money(b.current)}</TableCell>
                      <TableCell className="hidden text-right sm:table-cell">{b.arrears ? money(b.arrears) : '—'}</TableCell>
                      <TableCell className="text-right font-medium">{money(b.total)}</TableCell>
                      <TableCell>
                        <Badge variant={sent.has(b.billNo) ? 'default' : 'outline'}>{sent.has(b.billNo) ? 'Sent' : 'Draft'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
      {runs.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Bill runs</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead className="hidden sm:table-cell">Sent via</TableHead>
                    <TableHead className="text-right">Bills</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="hidden sm:table-cell">By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <p className="font-medium">{r.period}</p>
                        <p className="text-xs text-muted-foreground">{new Date(r.sentAt).toLocaleString(society.locale, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{r.channel}</TableCell>
                      <TableCell className="text-right">{r.count}</TableCell>
                      <TableCell className="text-right font-medium">{money(r.total)}</TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">{r.sentBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground">Bill runs are recorded here. Actual SMS and email delivery needs a messaging provider to be connected.</p>
        </section>
      )}
    </div>
  )
}
