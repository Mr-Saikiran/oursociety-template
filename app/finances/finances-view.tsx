'use client'

import { useState } from 'react'
import { ShieldCheck, TrendingUp, TrendingDown, Wallet, FileText, Download } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { financialStatements, money, moneyShort, type FinancialStatement } from '@/lib/data'

// Tabs follow whatever statement categories the society's data uses.
const categories = ['All', ...new Set(financialStatements.map((s) => s.category))]

function StatementCard({ s, onOpen }: { s: FinancialStatement; onOpen: (s: FinancialStatement) => void }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium leading-snug">{s.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.period}</p>
          </div>
          {s.audited ? (
            <Badge variant="secondary" className="shrink-0 gap-1">
              <ShieldCheck className="size-3" /> Audited
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0">Draft</Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-secondary/50 p-2.5">
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><TrendingUp className="size-3 text-primary" />Income</p>
            <p className="mt-0.5 font-serif text-sm font-semibold">{moneyShort(s.income)}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2.5">
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><TrendingDown className="size-3 text-destructive" />Expense</p>
            <p className="mt-0.5 font-serif text-sm font-semibold">{moneyShort(s.expense)}</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2.5">
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Wallet className="size-3 text-primary" />Balance</p>
            <p className="mt-0.5 font-serif text-sm font-semibold">{moneyShort(s.closingBalance)}</p>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={() => onOpen(s)}>
          <FileText data-icon="inline-start" />
          View statement
        </Button>
      </CardContent>
    </Card>
  )
}

export function FinancesView() {
  const [active, setActive] = useState<FinancialStatement | null>(null)
  const [cat, setCat] = useState('All')

  const filtered = cat === 'All' ? financialStatements : financialStatements.filter((s) => s.category === cat)
  const totalIncome = financialStatements.filter((s) => s.category !== 'Annual Audit').reduce((a, s) => a + s.income, 0)

  return (
    <>
      <Tabs value={cat} onValueChange={(v) => setCat(String(v))}>
        <TabsList className="flex-wrap">
          {categories.map((c) => (
            <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={cat} className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => <StatementCard key={s.id} s={s} onOpen={setActive} />)}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg gap-0 p-0">
          {active && (
            <>
              <DialogHeader className="border-b border-border p-5 text-left">
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="secondary">{active.category}</Badge>
                  {active.audited && (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <ShieldCheck className="size-3.5" />{active.auditor}
                    </span>
                  )}
                </div>
                <DialogTitle className="font-serif text-xl">{active.title}</DialogTitle>
                <DialogDescription>{active.period}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[55vh]">
                <div className="flex flex-col gap-1 p-5">
                  {active.openingBalance != null && (
                    <Row label="Opening balance" amount={active.openingBalance} muted />
                  )}
                  {active.lineItems.map((li, i) => (
                    <Row key={i} label={li.label} amount={li.amount} sign={li.type === 'income' ? '+' : '−'} type={li.type} />
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t border-border p-5">
                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Closing balance</p>
                    <p className="font-serif text-xl font-semibold">{money(active.closingBalance)}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Download data-icon="inline-start" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Income across monthly, festival and fund statements to date: {money(totalIncome)}. Statements are prepared by the Treasurer and reviewed by the audit sub-committee.
      </p>
    </>
  )
}

function Row({
  label,
  amount,
  sign,
  type,
  muted,
}: {
  label: string
  amount: number
  sign?: string
  type?: 'income' | 'expense'
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-0">
      <span className={`text-sm ${muted ? 'text-muted-foreground' : ''}`}>{label}</span>
      <span
        className={`shrink-0 font-medium tabular-nums ${
          type === 'income' ? 'text-primary' : type === 'expense' ? 'text-destructive' : 'text-muted-foreground'
        }`}
      >
        {sign} {money(amount)}
      </span>
    </div>
  )
}
