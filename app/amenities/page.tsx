import type { Metadata } from 'next'
import { BookingButton, UpcomingBookings } from './booking-button'
import { all } from '@/lib/repo'
import {
  Trees,
  Building2,
  Dumbbell,
  Landmark,
  Cctv,
  Sparkles,
  Clock,
  MapPin,
  CalendarCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { amenities, type Amenity } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Amenities',
  description: 'Community hall, parks, sports courts and security facilities.',
}

const categoryIcon: Record<string, typeof Trees> = {
  Common: Building2,
  Park: Trees,
  Sports: Dumbbell,
  Spiritual: Landmark,
  Security: Cctv,
}

/* Each category wears one soft tone, so the grid reads at a glance. */
const categoryTone: Record<string, 'sun' | 'mint' | 'coral' | 'sky'> = {
  Common: 'sun',
  Park: 'mint',
  Sports: 'coral',
  Spiritual: 'sun',
  Security: 'sky',
}

const toneWell = {
  sun: 'bg-tone-sun text-tone-sun-ink',
  mint: 'bg-tone-mint text-tone-mint-ink',
  coral: 'bg-tone-coral text-tone-coral-ink',
  sky: 'bg-tone-sky text-tone-sky-ink',
}

const statusMeta = {
  available: { label: 'Available', variant: 'mint' as const },
  maintenance: { label: 'Under maintenance', variant: 'sun' as const },
  planned: { label: 'Planned', variant: 'sky' as const },
}

function AmenityCard({ a }: { a: Amenity }) {
  const Icon = categoryIcon[a.category] ?? Sparkles
  const meta = statusMeta[a.status]
  const tone = categoryTone[a.category] ?? 'mint'
  return (
    <Card className="flex flex-col py-0">
      <CardContent className="flex flex-1 flex-col gap-4 p-3">
        <div className={`flex items-center gap-4 rounded-2xl p-5 ${toneWell[tone]}`}>
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-card/70" aria-hidden>
            <Icon className="size-7" />
          </span>
          <span className="text-base font-bold">{a.category}</span>
        </div>
        <div className="flex flex-1 flex-col gap-3 px-3 pb-3">
          <div>
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg font-bold leading-snug">{a.name}</p>
              <Badge variant={meta.variant} className="mt-0.5">{meta.label}</Badge>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" aria-hidden />{a.location}
            </p>
          </div>
          <p className="flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">{a.description}</p>
          {a.timings && (
            <p className="flex w-fit items-center gap-2 rounded-full bg-muted px-3.5 py-1.5 text-sm font-semibold text-foreground">
              <Clock className="size-4 text-primary" aria-hidden />{a.timings}
            </p>
          )}
          {a.bookable && a.status !== 'planned' && (
            <div className="pt-1">
              <BookingButton amenity={a.name} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AmenitiesPage() {
  const bookings = await all('bookings')
  const categories = Array.from(new Set(amenities.map((a) => a.category)))
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Amenities"
        description="Facilities maintained by the association for residents: community hall, parks, sports areas and 24x7 security."
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Badge key={c} variant={categoryTone[c] ?? 'mint'} className="h-8 px-3.5 text-sm">{c}</Badge>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((a) => (
          <AmenityCard key={a.id} a={a} />
        ))}
      </div>
      <div className="mt-8">
        <UpcomingBookings bookings={bookings} />
      </div>
    </div>
  )
}
