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

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden p-0 lg:col-span-2">
          <div className="aspect-[16/11] w-full sm:aspect-[16/9]">
            <iframe
              title={`${society.shortName} location map`}
              src={mapSrc}
              className="size-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="flex items-center gap-2 border-t border-border p-4 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0 text-primary" />
            {society.location} — {society.pincode}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DoorOpen className="size-4 text-primary" />
                <CardTitle>Entry gates</CardTitle>
              </div>
              <CardDescription>CCTV monitored 24x7</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {gates.map((g) => (
                <div key={g} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                  <DoorOpen className="size-3.5 shrink-0 text-muted-foreground" />
                  {g}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <CardTitle>Key landmarks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {Object.entries(landmarks).map(([road, name]) => (
                <div key={road} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                  <span>{name}</span>
                  <Badge variant="outline">{terms.block} {road}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Route className="size-4 text-primary" />
            <CardTitle>{terms.block} layout</CardTitle>
          </div>
          <CardDescription>All {society.roads.length} {terms.blocks} across {layout.length} groups. Highlighted ones have common amenities.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {layout.map((g) => (
            <div key={g.group}>
              <p className="mb-2 text-xs font-medium text-muted-foreground">{g.group}</p>
              <div className="flex flex-wrap gap-2">
                {g.blocks.map((lane) => {
                  const hasLandmark = lane in landmarks
                  return (
                    <div
                      key={lane}
                      className={`flex min-w-[4.5rem] flex-col items-center rounded-xl border p-3 text-center ${
                        hasLandmark ? 'border-primary/40 bg-secondary/60' : 'border-border bg-card'
                      }`}
                    >
                      <span className="font-serif text-lg font-semibold">{lane}</span>
                      {hasLandmark && (
                        <span className="mt-0.5 text-[10px] leading-tight text-primary">{landmarks[lane]}</span>
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
