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
    <div className="flex flex-col gap-6">
      {/* Key figures: one card, parted by hairlines */}
      <Card className="py-0">
        <CardContent className="grid p-0 sm:grid-cols-3">
          <div className="flex flex-col gap-1 p-5 lg:p-6">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
              <ArrowDownLeft className="size-4 text-primary" aria-hidden />
              Total income
            </p>
            <p className="tabular text-3xl font-extrabold tracking-tight text-primary lg:text-4xl">{money(income)}</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-border p-5 sm:border-t-0 sm:border-l lg:p-6">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
              <ArrowUpRight className="size-4 text-destructive" aria-hidden />
              Total expenses
            </p>
            <p className="tabular text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{money(expense)}</p>
          </div>
          <div className="flex flex-col gap-1 border-t border-border p-5 sm:border-t-0 sm:border-l lg:p-6">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
              <Scale className="size-4" aria-hidden />
              Net surplus
            </p>
            <p className="tabular text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{money(income - expense)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="flex min-w-0 flex-col gap-4 lg:order-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
            <CardContent className="p-2 sm:p-3">
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
                    <TableRow key={e.id} className="focus-within:bg-muted">
                      <TableCell className="tabular whitespace-nowrap font-semibold text-muted-foreground">{fmt(e.date)}</TableCell>
                      <TableCell className="font-bold">{e.description}</TableCell>
                      <TableCell className="hidden sm:table-cell"><Badge variant={e.type === 'income' ? 'mint' : 'sky'}>{e.category}</Badge></TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{e.mode}</TableCell>
                      <TableCell className={`tabular whitespace-nowrap text-right text-base font-extrabold ${e.type === 'income' ? 'text-primary' : 'text-foreground'}`}>
                        {e.type === 'income' ? '+' : '−'}{money(e.amount)}
                      </TableCell>
                      {canEdit && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="focus-visible:ring-ring"
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

        <Card className="h-fit lg:order-2">
          <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
            <p className="text-xl font-extrabold tracking-tight">Expenses by category</p>
            {byCategory.map(([cat, amt]) => (
              <div key={cat} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{cat}</span>
                  <span className="tabular font-extrabold">{money(amt)}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted"><div className="h-2.5 rounded-full bg-primary" style={{ width: `${(amt / byCategory[0][1]) * 100}%` }} /></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
