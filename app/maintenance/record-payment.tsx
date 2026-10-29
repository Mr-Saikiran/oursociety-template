'use client'

import { useState } from 'react'
import { IndianRupee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAction } from '@/components/use-action'
import { recordPayment } from '@/app/actions/data'
import { money, type MaintenanceRecord } from '@/lib/data'
import type { LedgerEntry } from '@/lib/data-extra'
import { society } from '@/society/config'

const modes: LedgerEntry['mode'][] = ['UPI', 'Bank transfer', 'Cash', 'Cheque']

export function RecordPayment({ record }: { record: MaintenanceRecord }) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(String(record.dueAmount))
  const [mode, setMode] = useState<LedgerEntry['mode']>('UPI')
  const { pending, run } = useAction()

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setAmount(String(record.dueAmount)) }}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <IndianRupee data-icon="inline-start" />
        Record payment
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>
          <DialogDescription className="text-[0.9375rem]">
            {record.owner}: {society.terms.unit} {record.plotNo}, {society.terms.block} {record.road}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-baseline gap-2 rounded-2xl bg-tone-coral px-4 py-3 text-tone-coral-ink">
          <span className="tabular text-3xl font-extrabold tracking-tight">{money(record.dueAmount)}</span>
          <span className="font-bold">due</span>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            run(() => recordPayment(record.plotNo, Number(amount), mode), () => setOpen(false))
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`amt-${record.plotNo}`}>Amount (₹)</Label>
            <Input id={`amt-${record.plotNo}`} className="tabular text-lg font-bold" type="number" min={1} max={record.dueAmount} required value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Mode</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as LedgerEntry['mode'])}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{modes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">This also adds an income entry to the Accounting ledger.</p>
          <DialogFooter><Button type="submit" disabled={pending}>Save payment</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
