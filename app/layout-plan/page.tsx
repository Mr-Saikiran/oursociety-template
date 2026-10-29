import type { Metadata } from 'next'
import { MapPin, Navigation, Route, DoorOpen } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { society } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Layout Plan',
  description: `Location map and ${society.terms.block.toLowerCase()}-wise layout of ${society.shortName}.`,
}

// Keyless Google Maps embed centered on the society location.
const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(society.mapQuery)}&z=16&output=embed`
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(society.mapQuery)}`

const { layout, landmarks, gates, terms } = society

export default function LayoutPlanPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Layout Plan"
        description={`${society.name} is located in ${society.location}, spanning ${society.roads.length} ${terms.blocks} and ${society.totalPlots} ${terms.units}.`}
        action={
          <Button nativeButton={false} render={<a href={directionsUrl} target="_blank" rel="noopener noreferrer" />}>
            <Navigation data-icon="inline-start" />
            Get directions
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="py-0 lg:col-span-2">
          <CardContent className="flex flex-col gap-3 p-3">
            <div className="aspect-[16/11] w-full overflow-hidden rounded-2xl bg-muted sm:aspect-[16/9]">
              <iframe
                title={`${society.shortName} location map`}
                src={mapSrc}
                className="size-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-tone-sky px-4 py-3 text-[0.9375rem] font-semibold text-tone-sky-ink">
              <MapPin className="size-5 shrink-0" aria-hidden />
              {society.location}, {society.pincode}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <DoorOpen className="size-5 text-primary" aria-hidden />
                <CardTitle className="text-xl">Entry gates</CardTitle>
              </div>
              <CardDescription className="text-[0.9375rem]">CCTV monitored 24x7</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {gates.map((g) => (
                  <li key={g} className="flex items-center gap-3 py-3 text-[0.9375rem] font-semibold first:pt-0 last:pb-0">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-tone-mint text-tone-mint-ink" aria-hidden>
                      <DoorOpen className="size-4" />
                    </span>
                    {g}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <MapPin className="size-5 text-primary" aria-hidden />
                <CardTitle className="text-xl">Key landmarks</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {Object.entries(landmarks).map(([road, name]) => (
                  <li key={road} className="flex items-center justify-between gap-3 py-3 text-[0.9375rem] first:pt-0 last:pb-0">
                    <span className="font-semibold">{name}</span>
                    <Badge variant="sun" className="shrink-0">{terms.block} {road}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Route className="size-5 text-primary" aria-hidden />
            <CardTitle className="text-xl">{terms.block} layout</CardTitle>
          </div>
          <CardDescription className="text-[0.9375rem]">All {society.roads.length} {terms.blocks} across {layout.length} groups. Highlighted ones have common amenities.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {layout.map((g) => (
            <div key={g.group} className="rounded-2xl bg-muted p-4 sm:p-5">
              <p className="mb-3 text-sm font-bold text-muted-foreground">{g.group}</p>
              <div className="flex flex-wrap gap-2.5">
                {g.blocks.map((lane) => {
                  const hasLandmark = lane in landmarks
                  return (
                    <div
                      key={lane}
                      className={`flex min-w-[4.5rem] flex-col items-center justify-center rounded-2xl px-3 py-2.5 text-center ${
                        hasLandmark ? 'max-w-[9rem] bg-tone-sun text-tone-sun-ink' : 'bg-card text-foreground'
                      }`}
                    >
                      <span className="tabular text-lg font-extrabold leading-tight">{lane}</span>
                      {hasLandmark && (
                        <span className="mt-0.5 text-xs font-semibold leading-tight">{landmarks[lane]}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
