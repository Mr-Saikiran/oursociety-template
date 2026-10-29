'use client'

import { useState } from 'react'
import { Phone, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { contacts, type Contact } from '@/lib/data-extra'

const groups: Contact['group'][] = ['Emergency', 'Committee', 'Staff', 'Vendors', 'Authorities']

const groupTone: Record<Contact['group'], 'coral' | 'mint' | 'sun' | 'sky'> = {
  Emergency: 'coral',
  Committee: 'mint',
  Staff: 'sun',
  Vendors: 'sky',
  Authorities: 'sky',
}

const toneCircle = {
  coral: 'bg-tone-coral text-tone-coral-ink',
  mint: 'bg-tone-mint text-tone-mint-ink',
  sun: 'bg-tone-sun text-tone-sun-ink',
  sky: 'bg-tone-sky text-tone-sky-ink',
} as const

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('')
}

export function ContactsView() {
  const [q, setQ] = useState('')
  const match = (c: Contact) => `${c.name} ${c.role}`.toLowerCase().includes(q.toLowerCase())

  return (
    <div className="flex flex-col gap-6">
      <InputGroup className="sm:max-w-sm">
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupInput placeholder="Search name or role…" value={q} onChange={(e) => setQ(e.target.value)} />
      </InputGroup>

      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((g) => {
          const list = contacts.filter((c) => c.group === g && match(c))
          if (list.length === 0) return null
          const tone = groupTone[g]
          return (
            <Card key={g} className={`h-fit ${g === 'Emergency' ? 'lg:col-span-2' : ''}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl">{g}</CardTitle>
                  <Badge variant={tone}>{list.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {list.map((c) => (
                    <li key={c.id} className="flex items-center gap-4 py-4 first:pt-1 last:pb-0">
                      <span
                        aria-hidden
                        className={`flex size-12 shrink-0 items-center justify-center rounded-full text-base font-extrabold ${toneCircle[tone]}`}
                      >
                        {initials(c.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-bold">{c.name}</p>
                        <p className="text-[0.9375rem] text-muted-foreground">{c.role}</p>
                        <p className="tabular text-sm font-semibold text-muted-foreground">{c.phone}</p>
                      </div>
                      <Button
                        variant={g === 'Emergency' ? 'destructive' : 'outline'}
                        className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        aria-label={`Call ${c.name}`}
                        nativeButton={false}
                        render={<a href={`tel:${c.phone.replace(/\s/g, '')}`} />}
                      >
                        <Phone data-icon="inline-start" />
                        Call
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
