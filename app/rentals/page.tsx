import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { rentals, money } from "@/lib/data"
import { BedDouble, Maximize, MapPin, Phone, CalendarDays } from "lucide-react"
import { society } from '@/society/config'

export const metadata: Metadata = {
  title: "Properties for Rent",
  description: `Homes available for rent inside ${society.shortName}.`,
}

const furnishingVariant: Record<string, "default" | "secondary" | "outline"> = {
  "Fully furnished": "default",
  "Semi-furnished": "secondary",
  Unfurnished: "outline",
}

export default function RentalsPage() {
  const available = rentals.filter((r) => r.status === "available")
  const rented = rentals.filter((r) => r.status === "rented")

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Properties for Rent"
        description="Houses and villas listed by owners within the community. Contact owners directly — no brokerage."
      />

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Badge variant="secondary" className="font-normal">
          {available.length} available now
        </Badge>
        <span className="text-muted-foreground">{rented.length} recently rented</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rentals.map((r) => (
          <Card key={r.id} className="flex flex-col overflow-hidden">
            <CardHeader className="gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span className="font-serif text-lg leading-tight font-semibold text-balance">
                    {r.bhk} {r.type}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden />
                    {society.terms.unit} {r.plotNo}, {society.terms.block} {r.road}
                  </span>
                </div>
                <Badge variant={r.status === "available" ? "default" : "outline"}>
                  {r.status === "available" ? "Available" : "Rented"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-foreground">{money(r.rent)}</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Maximize className="size-4" aria-hidden />
                  {r.area} sq ft
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <BedDouble className="size-4" aria-hidden />
                  {r.bhk}
                </span>
                <span className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="size-4" aria-hidden />
                  Available from {new Date(r.available).toLocaleDateString(society.locale, { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={furnishingVariant[r.furnishing]} className="font-normal">
                  {r.furnishing}
                </Badge>
                <span className="text-sm text-muted-foreground">Deposit {money(r.deposit)}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {r.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </CardContent>

            <Separator />
            <CardFooter className="flex items-center justify-between gap-2 py-3">
              <span className="text-sm font-medium">{r.contactName}</span>
              {r.status === "available" ? (
                <a
                  href={`tel:${r.contactPhone.replace(/\s/g, "")}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <Phone className="size-4" aria-hidden />
                  Call owner
                </a>
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
