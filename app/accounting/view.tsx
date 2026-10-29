'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ArrowDownLeft, ArrowUpRight, Plus, Scale, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { money } from '@/lib/data'
import { useCanEdit } from '@/components/session-provider'
import { ReadOnlyNote } from '@/components/read-only-note'
import type { LedgerEntry } from '@/lib/data-extra'
import { createLedgerEntry, deleteLedgerEntry } from '@/app/actions/data'
import { useAction } from '@/components/use-action'
import { society } from '@/society/config'

const fmt = (d: string) => new Date(d).toLocaleDateString(society.locale, { day: 'numeric', month: 'short' })

function AddEntry() {
  const [open, setOpen] = useState(false)
  const { pending, run } = useAction()
  const [type, setType] = useState<LedgerEntry['type']>('expense')
  const [mode, setMode] = useState<LedgerEntry['mode']>('UPI')

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    run(
      () =>
        createLedgerEntry({
          type,
          mode,
          category: String(f.get('category')),
          description: String(f.get('description')),
          amount: Number(f.get('amount')),
        }),
      () => setOpen(false),
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        Add entry
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New ledger entry</DialogTitle>
          <DialogDescription>Record an income or expense transaction.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Type</Label>
              <Select items={[{ value: 'income', label: 'Income' }, { value: 'expense', label: 'Expense' }]} value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['UPI', 'Bank transfer', 'Cash', 'Cheque'].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" required placeholder="e.g. Security" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input id="amount" name="amount" type="number" min={1} required />
          </div>
          <DialogFooter><Button type="submit" disabled={pending}>Save entry</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AccountingView({ entries }: { entries: LedgerEntry[] }) {
  const canEdit = useCanEdit()
  const { pending, run } = useAction()
  const [tab, setTab] = useState<'all' | 'income' | 'expense'>('all')

  const income = entries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0)
  const expense = entries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0)

  const byCategory = useMemo(() => {
    const m = new Map<string, number>()
    entries.filter((e) => e.type === 'expense').forEach((e) => m.set(e.category, (m.get(e.category) ?? 0) + e.amount))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [entries])

  const shown = entries
    .filter((e) => tab === 'all' || e.type === tab)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-4">
          <ArrowDownLeft className="size-5 text-primary" aria-hidden />
          <div><p className="text-xl font-semibold">{money(income)}</p><p className="text-sm text-muted-foreground">Total income</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <ArrowUpRight className="size-5 text-destructive" aria-hidden />
          <div><p className="text-xl font-semibold">{money(expense)}</p><p className="text-sm text-muted-foreground">Total expenses</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4">
          <Scale className="size-5 text-muted-foreground" aria-hidden />
          <div><p className="text-xl font-semibold">{money(income - expense)}</p><p className="text-sm text-muted-foreground">Net surplus</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <p className="font-medium">Expenses by category</p>
          {byCategory.map(([cat, amt]) => (
            <div key={cat} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm"><span>{cat}</span><span className="text-muted-foreground">{money(amt)}</span></div>
              <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(amt / byCategory[0][1]) * 100}%` }} /></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expenses</TabsTrigger>
          </TabsList>
        </Tabs>
        {canEdit ? <AddEntry /> : <ReadOnlyNote action="add ledger entries" />}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Mode</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                {canEdit && <TableHead className="w-10"><span className="sr-only">Delete</span></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{fmt(e.date)}</TableCell>
                  <TableCell className="font-medium">{e.description}</TableCell>
                  <TableCell className="hidden sm:table-cell"><Badge variant="secondary">{e.category}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{e.mode}</TableCell>
                  <TableCell className={`text-right font-medium ${e.type === 'income' ? 'text-primary' : ''}`}>
                    {e.type === 'income' ? '+' : '−'}{money(e.amount)}
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete entry: ${e.description}`}
                        disabled={pending}
                        onClick={() => confirm(`Delete "${e.description}"?`) && run(() => deleteLedgerEntry(e.id))}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
