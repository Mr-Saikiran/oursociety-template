'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Download, FileText, FileSpreadsheet, Search, SearchX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { documents, type SocietyDocument } from '@/lib/data-extra'
import { society } from '@/society/config'

const fmt = (d: string) => new Date(d).toLocaleDateString(society.locale, { day: 'numeric', month: 'short', year: 'numeric' })
const categories = ['All', 'Byelaws', 'Minutes', 'Financial', 'Legal', 'Forms', 'Certificates'] as const

const categoryTone: Record<SocietyDocument['category'], 'sky' | 'sun' | 'mint' | 'coral'> = {
  Byelaws: 'sky',
  Minutes: 'sun',
  Financial: 'mint',
  Legal: 'coral',
  Forms: 'sky',
  Certificates: 'mint',
}

const typeTone: Record<SocietyDocument['type'], string> = {
  PDF: 'bg-tone-coral text-tone-coral-ink',
  DOCX: 'bg-tone-sky text-tone-sky-ink',
  XLSX: 'bg-tone-mint text-tone-mint-ink',
}

export function DocumentsView() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<(typeof categories)[number]>('All')

  const shown = documents.filter(
    (d: SocietyDocument) => (cat === 'All' || d.category === cat) && d.name.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={cat} onValueChange={(v) => setCat(v as typeof cat)}>
          <TabsList className="h-auto flex-wrap">
            {categories.map((c) => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
          </TabsList>
        </Tabs>
        <InputGroup className="sm:max-w-sm lg:w-80">
          <InputGroupAddon><Search /></InputGroupAddon>
          <InputGroupInput placeholder="Search documents…" value={q} onChange={(e) => setQ(e.target.value)} />
        </InputGroup>
      </div>

      <Card>
        <CardContent className="px-3 sm:px-5">
          {shown.length > 0 && (
            <ul className="divide-y divide-border">
              {shown.map((d) => {
                const Icon = d.type === 'XLSX' ? FileSpreadsheet : FileText
                return (
                  <li key={d.id} className="flex items-center gap-4 px-1 py-4">
                    <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${typeTone[d.type]}`}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold">{d.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">{d.type}</span>
                        <span className="tabular">{d.size}</span>
                        <span>{fmt(d.date)}</span>
                        <Badge variant={categoryTone[d.category]} className="sm:hidden">{d.category}</Badge>
                      </div>
                    </div>
                    <Badge variant={categoryTone[d.category]} className="hidden sm:inline-flex">{d.category}</Badge>
                    <Button
                      size="icon"
                      variant="outline"
                      className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      aria-label={`Download ${d.name}`}
                      onClick={() => toast.info('Downloads will work once file storage is connected.')}
                    >
                      <Download />
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
          {shown.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-tone-sky text-tone-sky-ink">
                <SearchX className="size-6" aria-hidden />
              </span>
              <p className="text-base font-bold">No documents found.</p>
              <p className="text-[0.9375rem] text-muted-foreground">Try a different search or category.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
