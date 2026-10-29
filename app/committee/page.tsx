import type { Metadata } from 'next'
import { Phone, Mail, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

const avatarTones = [
  'bg-tone-mint text-tone-mint-ink',
  'bg-tone-sun text-tone-sun-ink',
  'bg-tone-sky text-tone-sky-ink',
  'bg-tone-coral text-tone-coral-ink',
]

function MemberCard({ member, lead, index }: { member: CommitteeMember; lead?: boolean; index: number }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-14 shrink-0 after:border-transparent">
            <AvatarFallback
              className={`text-lg font-extrabold ${lead ? 'bg-primary text-primary-foreground' : avatarTones[index % avatarTones.length]}`}
            >
              {initials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold leading-snug">{member.name}</p>
            <p className={`text-[0.9375rem] font-semibold ${lead ? 'text-primary' : 'text-muted-foreground'}`}>
              {member.role}
            </p>
            {member.road && (
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {society.terms.block} {member.road}
              </p>
            )}
          </div>
        </div>

        {(member.phone || member.email) && (
          <div className="flex flex-wrap gap-2">
            {member.phone && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full px-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                nativeButton={false}
                render={<a href={`tel:${member.phone.replace(/\s/g, '')}`} />}
              >
                <Phone data-icon="inline-start" />
                <span className="tabular">{member.phone}</span>
              </Button>
            )}
            {member.email && (
              <Button
                size="sm"
                variant="outline"
                className="max-w-full rounded-full px-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                nativeButton={false}
                render={<a href={`mailto:${member.email}`} />}
              >
                <Mail data-icon="inline-start" />
                <span className="truncate">{member.email}</span>
              </Button>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3 rounded-2xl bg-muted p-4">
          <div className="flex flex-wrap gap-1.5">
            {member.responsibilities.map((r) => (
              <span key={r} className="rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                {r}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Serving since {member.since}</p>
        </div>
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

      <section className="mb-12">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-extrabold tracking-tight">Executive Committee</h2>
          <Badge variant="mint">{executiveCommittee.length} members</Badge>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {executiveCommittee.map((m, i) => (
            <MemberCard key={m.id} member={m} lead={i < 3} index={i} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-extrabold tracking-tight">Advisory Committee</h2>
          <Badge variant="sky">{advisoryCommittee.length} members</Badge>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advisoryCommittee.map((m, i) => (
            <MemberCard key={m.id} member={m} index={i + 1} />
          ))}
        </div>
      </section>
    </div>
  )
}
