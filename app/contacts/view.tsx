'use client'

import { useState } from 'react'
import { Phone, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { contacts, type Contact } from '@/lib/data-extra'

const groups: Contact['group'][] = ['Emergency', 'Committee', 'Staff', 'Vendors', 'Authorities']

export function ContactsView() {
  const [q, setQ] = useState('')
  const match = (c: Contact) => `${c.name} ${c.role}`.toLowerCase().includes(q.toLowerCase())

  return (
    <div className="flex flex-col gap-6">
      <InputGroup className="sm:max-w-sm">
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupInput placeholder="Search name or role…" value={q} onChange={(e) => setQ(e.target.value)} />
      </InputGroup>

      {groups.map((g) => {
        const list = contacts.filter((c) => c.group === g && match(c))
        if (list.length === 0) return null
        return (
          <section key={g} className="flex flex-col gap-3">
            <h2 className="font-serif text-lg font-semibold">{g}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <Card key={c.id}>
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.role} · {c.phone}</p>
                    </div>
                    <Button
                      size="icon"
                      variant={g === 'Emergency' ? 'destructive' : 'outline'}
                      aria-label={`Call ${c.name}`}
                      nativeButton={false}
                      render={<a href={`tel:${c.phone.replace(/\s/g, '')}`} />}
                    >
                      <Phone />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
