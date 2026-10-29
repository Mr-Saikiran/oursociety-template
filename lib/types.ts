// Shapes of every record the app stores. Seed data in society/ follows these.
import type { requestCategories } from '@/society/config'

export type CommitteeMember = {
  id: string
  name: string
  role: string
  road?: string
  phone?: string
  email?: string
  since: string
  responsibilities: string[]
}

export type Meeting = {
  id: string
  title: string
  type: 'AGM' | 'EC Meeting' | 'Temple Trust' | 'Special'
  date: string // ISO
  time: string
  venue: string
  status: 'upcoming' | 'held'
  agenda: string[]
  minutes?: {
    summary: string
    decisions: { topic: string; detail: string; initiator?: string }[]
    attendees?: number
  }
}

export type FinancialStatement = {
  id: string
  title: string
  period: string
  category: 'Monthly' | 'Festival' | 'Temple' | 'Annual Audit'
  openingBalance?: number
  income: number
  expense: number
  closingBalance: number
  audited: boolean
  auditor?: string
  lineItems: { label: string; amount: number; type: 'income' | 'expense' }[]
}

export type MaintenanceRecord = {
  plotNo: string
  road: string
  owner: string
  status: 'paid' | 'partial' | 'due'
  paidAmount: number
  dueAmount: number
  lastPaid?: string
}

export type Amenity = {
  id: string
  name: string
  category: string
  location: string
  description: string
  status: 'available' | 'maintenance' | 'planned'
  bookable: boolean
  timings?: string
}

export type Rental = {
  id: string
  plotNo: string
  road: string
  type: 'Independent House' | 'Villa' | 'Duplex' | 'Portion'
  bhk: string
  rent: number
  deposit: number
  furnishing: 'Unfurnished' | 'Semi-furnished' | 'Fully furnished'
  area: number // sq ft
  available: string
  contactName: string
  contactPhone: string
  amenities: string[]
  status: 'available' | 'rented'
}

export type RequestCategory = (typeof requestCategories)[number]['id']

export type ServiceRequest = {
  id: string
  ticketNo: string
  category: RequestCategory
  title: string
  description: string
  plotNo: string
  road: string
  raisedBy: string
  raisedOn: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  updates: { on: string; note: string }[]
}

export type LedgerEntry = {
  id: string
  date: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  mode: 'UPI' | 'Bank transfer' | 'Cash' | 'Cheque'
}

export type Visitor = {
  id: string
  name: string
  phone: string
  purpose: 'Guest' | 'Delivery' | 'Service' | 'Cab' | 'Contractor'
  visiting: string // plot + road
  resident: string
  expectedAt: string
  status: 'pending' | 'approved' | 'inside' | 'exited' | 'denied'
}

export type Notice = {
  id: string
  title: string
  body: string
  date: string
  audience: 'all' | 'unit'
  audienceLabel: string
  category: 'General' | 'Maintenance' | 'Event' | 'Security' | 'Urgent'
  attachments: string[]
}

export type SocietyDocument = {
  id: string
  name: string
  category: 'Byelaws' | 'Minutes' | 'Financial' | 'Legal' | 'Forms' | 'Certificates'
  date: string
  size: string
  type: 'PDF' | 'DOCX' | 'XLSX'
}

export type Contact = {
  id: string
  name: string
  role: string
  phone: string
  group: 'Committee' | 'Staff' | 'Emergency' | 'Vendors' | 'Authorities'
}

export type Poll = {
  id: string
  question: string
  description: string
  closes: string
  options: { id: string; label: string; votes: number }[]
}
