import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { rentals, money } from "@/lib/data"
import { BedDouble, Maximize, MapPin, Phone, CalendarDays } from "lucide-react"
import { society } from '@/society/config'

export const metadata: Metadata = {
  title: "Properties for Rent",
  description: `Homes available for rent inside ${society.shortName}.`,
}

const furnishingVariant: Record<string, "mint" | "sun" | "sky"> = {
  "Fully furnished": "mint",
  "Semi-furnished": "sun",
  Unfurnished: "sky",
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

export default function RentalsPage() {
  const available = rentals.filter((r) => r.status === "available")
  const rented = rentals.filter((r) => r.status === "rented")

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Properties for Rent"
        description="Houses and villas listed by owners within the community. Contact owners directly, no brokerage."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="flex items-baseline gap-2 rounded-2xl bg-tone-mint px-4 py-2.5 text-tone-mint-ink">
          <span className="tabular text-2xl font-extrabold">{available.length}</span>
          <span className="text-[0.9375rem] font-bold">available now</span>
        </span>
        <span className="flex items-baseline gap-2 rounded-2xl bg-muted px-4 py-2.5 text-muted-foreground">
          <span className="tabular text-2xl font-extrabold text-foreground">{rented.length}</span>
          <span className="text-[0.9375rem] font-semibold">recently rented</span>
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rentals.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-balance text-lg font-bold leading-snug">
                    {r.bhk} {r.type}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" aria-hidden />
                    {society.terms.unit} {r.plotNo}, {society.terms.block} {r.road}
                  </span>
                </div>
                <Badge variant={r.status === "available" ? "mint" : "secondary"}>
                  {r.status === "available" ? "Available" : "Rented"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="tabular text-3xl font-extrabold tracking-tight text-primary">{money(r.rent)}</span>
                  <span className="text-sm font-semibold text-muted-foreground">/ month</span>
                </div>
                <span className="tabular text-sm text-muted-foreground">Deposit {money(r.deposit)}</span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-muted p-4 text-[0.9375rem]">
                <div className="flex items-center gap-2 font-semibold">
                  <Maximize className="size-4 shrink-0 text-primary" aria-hidden />
                  <span className="tabular">{r.area} sq ft</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <BedDouble className="size-4 shrink-0 text-primary" aria-hidden />
                  {r.bhk}
                </div>
                <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden />
                  Available from {new Date(r.available).toLocaleDateString(society.locale, { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={furnishingVariant[r.furnishing]}>
                  {r.furnishing}
                </Badge>
                {r.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-3 border-border bg-card py-4">
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tone-sky text-sm font-extrabold text-tone-sky-ink" aria-hidden>
                  {initials(r.contactName)}
                </span>
                <span className="truncate text-[0.9375rem] font-bold">{r.contactName}</span>
              </span>
              {r.status === "available" ? (
                <Button
                  className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  nativeButton={false}
                  render={<a href={`tel:${r.contactPhone.replace(/\s/g, "")}`} />}
                >
                  <Phone data-icon="inline-start" aria-hidden />
                  Call owner
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">Not available</span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
