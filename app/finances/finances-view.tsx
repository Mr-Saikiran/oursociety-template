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
    <Card className="transition-shadow duration-150 ease-out focus-within:shadow-md hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-bold leading-snug">{s.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{s.period}</p>
          </div>
          {s.audited ? (
            <Badge variant="mint" className="shrink-0 gap-1">
              <ShieldCheck className="size-3" /> Audited
            </Badge>
          ) : (
            <Badge variant="sun" className="shrink-0">Draft</Badge>
          )}
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground"><Wallet className="size-4 text-primary" />Balance</p>
          <p className="tabular text-3xl font-extrabold tracking-tight">{moneyShort(s.closingBalance)}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-tone-mint px-4 py-3 text-tone-mint-ink">
            <p className="flex items-center gap-1 text-sm font-bold"><TrendingUp className="size-4" />Income</p>
            <p className="tabular mt-0.5 text-lg font-extrabold">{moneyShort(s.income)}</p>
          </div>
          <div className="rounded-2xl bg-tone-coral px-4 py-3 text-tone-coral-ink">
            <p className="flex items-center gap-1 text-sm font-bold"><TrendingDown className="size-4" />Expense</p>
            <p className="tabular mt-0.5 text-lg font-extrabold">{moneyShort(s.expense)}</p>
          </div>
        </div>

        <Button variant="outline" className="mt-auto w-full focus-visible:ring-ring" onClick={() => onOpen(s)}>
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
        <TabsContent value={cat} className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => <StatementCard key={s.id} s={s} onOpen={setActive} />)}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg gap-0 p-0">
          {active && (
            <>
              <DialogHeader className="border-b border-border p-5 text-left sm:p-6">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="sky">{active.category}</Badge>
                  {active.audited && (
                    <Badge variant="mint" className="gap-1">
                      <ShieldCheck className="size-3.5" />{active.auditor}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl font-extrabold">{active.title}</DialogTitle>
                <DialogDescription className="text-[0.9375rem]">{active.period}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[55vh]">
                <div className="flex flex-col px-5 py-3 sm:px-6">
                  {active.openingBalance != null && (
                    <Row label="Opening balance" amount={active.openingBalance} muted />
                  )}
                  {active.lineItems.map((li, i) => (
                    <Row key={i} label={li.label} amount={li.amount} sign={li.type === 'income' ? '+' : '−'} type={li.type} />
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t border-border p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-tone-mint p-4 text-tone-mint-ink">
                  <div>
                    <p className="text-sm font-bold">Closing balance</p>
                    <p className="tabular text-2xl font-extrabold tracking-tight">{money(active.closingBalance)}</p>
                  </div>
                  <Button variant="outline" onClick={() => window.print()}>
                    <Download data-icon="inline-start" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <p className="mx-auto mt-8 max-w-2xl text-center text-[0.9375rem] leading-relaxed text-muted-foreground">
        Income across monthly, festival and fund statements to date: <span className="tabular font-extrabold text-foreground">{money(totalIncome)}</span>. Statements are prepared by the Treasurer and reviewed by the audit sub-committee.
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
    <div className="flex items-center justify-between gap-3 border-b border-border py-3.5 last:border-0">
      <span className={`text-[0.9375rem] ${muted ? 'text-muted-foreground' : 'font-semibold'}`}>{label}</span>
      <span
        className={`tabular shrink-0 text-base font-extrabold ${
          type === 'income' ? 'text-primary' : type === 'expense' ? 'text-destructive' : 'text-muted-foreground'
        }`}
      >
        {sign} {money(amount)}
      </span>
    </div>
  )
}
