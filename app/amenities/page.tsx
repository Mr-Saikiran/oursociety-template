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

const statusMeta = {
  available: { label: 'Available', variant: 'secondary' as const },
  maintenance: { label: 'Under maintenance', variant: 'outline' as const },
  planned: { label: 'Planned', variant: 'outline' as const },
}

function AmenityCard({ a }: { a: Amenity }) {
  const Icon = categoryIcon[a.category] ?? Sparkles
  const meta = statusMeta[a.status]
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Icon className="size-5" />
          </div>
          <Badge variant={meta.variant}>{meta.label}</Badge>
        </div>
        <div>
          <p className="font-medium leading-snug">{a.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />{a.location}
          </p>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
        {a.timings && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />{a.timings}
          </p>
        )}
        {a.bookable && a.status !== 'planned' && (
          <BookingButton amenity={a.name} />
        )}
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
        description="Facilities maintained by the association for residents — community hall, parks, sports areas and 24x7 security."
      />
      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Badge key={c} variant="secondary">{c}</Badge>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
