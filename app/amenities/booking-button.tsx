'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarCheck, Lock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCanEdit, useSession } from '@/components/session-provider'
import { useAction } from '@/components/use-action'
import { cancelBooking, createBooking } from '@/app/actions/data'
import type { Booking } from '@/lib/repo'
import { society } from '@/society/config'

const slots = ['6–9 AM', '9 AM–12 PM', '12–3 PM', '3–6 PM', '6–9 PM']

export function BookingButton({ amenity }: { amenity: string }) {
  const canEdit = useCanEdit()
  const [open, setOpen] = useState(false)
  const [slot, setSlot] = useState(slots[4])
  const { pending, run } = useAction()
  const today = new Date().toISOString().slice(0, 10)

  if (!canEdit) {
    return (
      <Button variant="outline" size="sm" className="w-full" nativeButton={false} render={<Link href="/login?next=/amenities" />}>
        <Lock data-icon="inline-start" />
        Sign in to book
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="w-full" />}>
        <CalendarCheck data-icon="inline-start" />
        Book
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Book {amenity}</DialogTitle>
          <DialogDescription>Bookings are confirmed instantly if the slot is free.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            const date = String(new FormData(e.currentTarget).get('date'))
            run(() => createBooking({ amenity, date, slot }), () => setOpen(false))
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`date-${amenity}`}>Date</Label>
            <Input id={`date-${amenity}`} name="date" type="date" min={today} defaultValue={today} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Time slot</Label>
            <Select value={slot} onValueChange={(v) => setSlot(String(v))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{slots.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter><Button type="submit" disabled={pending}>Confirm booking</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function UpcomingBookings({ bookings }: { bookings: Booking[] }) {
  const user = useSession()
  const { pending, run } = useAction()
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = bookings.filter((b) => b.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  if (upcoming.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">Upcoming bookings</h2>
      <Card>
        <CardContent className="flex flex-col divide-y p-0">
          {upcoming.map((b) => (
            <div key={b.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <CalendarCheck className="size-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{b.amenity}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(b.date).toLocaleDateString(society.locale, { weekday: 'short', day: 'numeric', month: 'short' })} · {b.slot} · {b.bookedBy}
                </p>
              </div>
              {user && (user.role === 'admin' || user.name === b.bookedBy) && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Cancel ${b.amenity} booking`}
                  disabled={pending}
                  onClick={() => confirm('Cancel this booking?') && run(() => cancelBooking(b.id))}
                >
                  <X />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
