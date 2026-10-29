'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Download, FileText, FileSpreadsheet, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { documents, type SocietyDocument } from '@/lib/data-extra'
import { society } from '@/society/config'

const fmt = (d: string) => new Date(d).toLocaleDateString(society.locale, { day: 'numeric', month: 'short', year: 'numeric' })
const categories = ['All', 'Byelaws', 'Minutes', 'Financial', 'Legal', 'Forms', 'Certificates'] as const

export function DocumentsView() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<(typeof categories)[number]>('All')

  const shown = documents.filter(
    (d: SocietyDocument) => (cat === 'All' || d.category === cat) && d.name.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-5">
      <InputGroup className="sm:max-w-sm">
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupInput placeholder="Search documents…" value={q} onChange={(e) => setQ(e.target.value)} />
      </InputGroup>

      <Tabs value={cat} onValueChange={(v) => setCat(v as typeof cat)}>
        <TabsList className="h-auto flex-wrap">
          {categories.map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((d) => {
          const Icon = d.type === 'XLSX' ? FileSpreadsheet : FileText
          return (
            <Card key={d.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.type} · {d.size} · {fmt(d.date)}</p>
                </div>
                <Badge variant="secondary" className="hidden sm:inline-flex">{d.category}</Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Download ${d.name}`}
                  onClick={() => toast.info('Downloads will work once file storage is connected.')}
                >
                  <Download />
                </Button>
              </CardContent>
            </Card>
          )
        })}
        {shown.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground sm:col-span-2">No documents found.</p>}
      </div>
    </div>
  )
}
