'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Mail, MessageSquare, Send, ReceiptText } from 'lucide-react'
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
    <div className="flex flex-col gap-6">
      {!canEdit && <ReadOnlyNote action="generate and send bills" />}
      <Card>
        <CardContent className="grid gap-5 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-6">
          <div className="flex flex-col gap-2">
            <Label className="text-[0.9375rem] font-bold">Billing frequency</Label>
            <Select items={Object.entries(frequencies).map(([value, v]) => ({ value, label: v.label }))} value={freq} onValueChange={(v) => { setFreq(v as Frequency); setGenerated(false) }}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(frequencies).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-[0.9375rem] font-bold">Send via</Label>
            <Select items={[{ value: 'both', label: 'SMS and email' }, { value: 'sms', label: 'SMS only' }, { value: 'email', label: 'Email only' }]} value={channel} onValueChange={(v) => setChannel(v as typeof channel)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="both">SMS and email</SelectItem>
                <SelectItem value="sms">SMS only</SelectItem>
                <SelectItem value="email">Email only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={!canEdit} className="h-11 px-6 focus-visible:ring-ring">
            <ReceiptText data-icon="inline-start" />
            Generate bills
          </Button>
        </CardContent>
      </Card>

      {generated && (
        <Card>
          <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 rounded-2xl bg-tone-sun p-5 text-tone-sun-ink sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
                <div>
                  <p className="text-sm font-bold">Bills for {f.period}</p>
                  <p className="tabular text-3xl font-extrabold tracking-tight">{bills.length}</p>
                </div>
                <div>
                  <p className="text-sm font-bold">Total</p>
                  <p className="tabular text-3xl font-extrabold tracking-tight">{money(totalBilled)}</p>
                </div>
              </div>
              <Button className="focus-visible:ring-ring" onClick={sendAll} disabled={!canEdit || pending || sent.size === bills.length}>
                {channel === 'email' ? <Mail data-icon="inline-start" /> : channel === 'sms' ? <MessageSquare data-icon="inline-start" /> : <Send data-icon="inline-start" />}
                {sent.size === bills.length ? 'All sent' : 'Send all'}
              </Button>
            </div>
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
                    <TableCell className="tabular text-sm text-muted-foreground">{b.billNo}</TableCell>
                    <TableCell className="font-bold">{b.owner}</TableCell>
                    <TableCell className="hidden sm:table-cell">{b.plotNo}, {b.road}</TableCell>
                    <TableCell className="tabular text-right">{money(b.current)}</TableCell>
                    <TableCell className="tabular hidden text-right sm:table-cell">
                      {b.arrears ? <span className="font-bold text-destructive">{money(b.arrears)}</span> : <span className="text-muted-foreground">Nil</span>}
                    </TableCell>
                    <TableCell className="tabular text-right text-base font-extrabold">{money(b.total)}</TableCell>
                    <TableCell>
                      <Badge variant={sent.has(b.billNo) ? 'mint' : 'sun'}>{sent.has(b.billNo) ? 'Sent' : 'Draft'}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {runs.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-extrabold tracking-tight">Bill runs</h2>
          <Card>
            <CardContent>
              <ul className="divide-y divide-border">
                {runs.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-base font-bold">{r.period}</p>
                      <p className="text-sm text-muted-foreground">{new Date(r.sentAt).toLocaleString(society.locale, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="sky">{r.channel}</Badge>
                        <span>By {r.sentBy}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="tabular text-2xl font-extrabold tracking-tight">{money(r.total)}</p>
                      <p className="tabular text-sm text-muted-foreground">{r.count} bills</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">Bill runs are recorded here. Actual SMS and email delivery needs a messaging provider to be connected.</p>
        </section>
      )}
    </div>
  )
}
