import type { Metadata } from 'next'
import { Phone, Mail, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { executiveCommittee, advisoryCommittee, type CommitteeMember } from '@/lib/data'
import { society } from '@/society/config'

export const metadata: Metadata = {
  title: 'Committee',
  description: `Executive and Advisory Committee members of ${society.acronym}.`,
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

function MemberCard({ member, lead }: { member: CommitteeMember; lead?: boolean }) {
  return (
    <Card className={lead ? 'border-primary/30 bg-secondary/30' : ''}>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <Avatar className="size-12 shrink-0">
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {initials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium leading-snug">{member.name}</p>
            <Badge variant={lead ? 'default' : 'secondary'} className="mt-1">
              {member.role}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          {member.road && (
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0" /> {society.terms.block} {member.road}
            </span>
          )}
          {member.phone && (
            <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-foreground">
              <Phone className="size-3.5 shrink-0" /> {member.phone}
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`} className="flex items-center gap-2 hover:text-foreground">
              <Mail className="size-3.5 shrink-0" /> {member.email}
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
          {member.responsibilities.map((r) => (
            <span key={r} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {r}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Serving since {member.since}</p>
      </CardContent>
    </Card>
  )
}

export default function CommitteePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Committees"
        description="The Executive Committee (EC) manages day-to-day governance and development. The Advisory Committee provides guidance on legal, infrastructure and community matters."
      />

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-serif text-lg font-semibold">Executive Committee</h2>
          <Badge variant="secondary">{executiveCommittee.length} members</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {executiveCommittee.map((m, i) => (
            <MemberCard key={m.id} member={m} lead={i < 3} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-serif text-lg font-semibold">Advisory Committee</h2>
          <Badge variant="secondary">{advisoryCommittee.length} members</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {advisoryCommittee.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </section>
    </div>
  )
}
