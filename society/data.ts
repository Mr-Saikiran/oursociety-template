// Seed data for the demo community. Every name, number and phone here is made up.
// Collections the app can edit (requests, maintenance, notices…) start from this
// data and are then stored in the database; the rest is shown as written here.
// Replace it with your own society's records.
import { society } from './config'
import type {
  Amenity, CommitteeMember, FinancialStatement, MaintenanceRecord, Meeting, Rental, ServiceRequest,
} from '@/lib/types'

/* ------------------------------------------------------------------ */
/* Committees                                                          */
/* ------------------------------------------------------------------ */

export const executiveCommittee: CommitteeMember[] = [
  { id: 'ec-1', name: 'Anita Sharma', role: 'President', road: 'A1', phone: '+91 90000 00001', email: 'president@example.org', since: 'Apr 2026', responsibilities: ['Overall governance', 'Development works'] },
  { id: 'ec-2', name: 'Rahul Verma', role: 'Secretary', road: 'B2', phone: '+91 90000 00002', email: 'secretary@example.org', since: 'Apr 2026', responsibilities: ['Member communication', 'Meetings & minutes'] },
  { id: 'ec-3', name: 'Meera Iyer', role: 'Treasurer', road: 'A3', phone: '+91 90000 00003', email: 'treasurer@example.org', since: 'Apr 2026', responsibilities: ['Accounts & balance sheets', 'Audit'] },
  { id: 'ec-4', name: 'Vikram Singh', role: 'Joint Secretary', road: 'C1', phone: '+91 90000 00004', since: 'Apr 2026', responsibilities: ['Infrastructure', 'Vendors'] },
  { id: 'ec-5', name: 'Fatima Khan', role: 'EC Member — Cultural', road: 'B1', phone: '+91 90000 00005', since: 'Apr 2026', responsibilities: ['Festivals & events', 'Kids activities'] },
]

export const advisoryCommittee: CommitteeMember[] = [
  { id: 'ac-1', name: 'Joseph D’Souza', role: 'Advisor — Legal & Byelaws', road: 'A2', since: '2020', responsibilities: ['Byelaws', 'Registration compliance'] },
  { id: 'ac-2', name: 'Lakshmi Nair', role: 'Advisor — Infrastructure', road: 'C2', since: '2021', responsibilities: ['Civil works review'] },
]

/* ------------------------------------------------------------------ */
/* Meetings & Minutes                                                  */
/* ------------------------------------------------------------------ */

export const meetings: Meeting[] = [
  {
    id: 'm-agm-2026', title: 'Annual General Body Meeting 2026', type: 'AGM', date: '2026-04-12', time: '5:00 PM', venue: 'Clubhouse', status: 'held',
    agenda: ['Elections for 2026–28', 'Audited accounts 2025–26', 'Maintenance rate for 2026–27'],
    minutes: {
      attendees: 64,
      summary: 'Members elected the new Executive Committee, approved the audited accounts and set the annual maintenance for 2026–27.',
      decisions: [
        { topic: 'Annual maintenance', initiator: 'Meera Iyer', detail: `Approved at ${society.annualMaintenance} per house per year.` },
        { topic: 'Solar street lights', initiator: 'Vikram Singh', detail: 'Approved a pilot of 10 solar street lights on Streets A1–A3.' },
      ],
    },
  },
  {
    id: 'm-ec-2026-10', title: 'EC Monthly Meeting — October 2026', type: 'EC Meeting', date: '2026-10-11', time: '7:00 PM', venue: 'Clubhouse', status: 'held',
    agenda: ['Diwali celebrations', 'Arrears review', 'CCTV maintenance contract'],
    minutes: { attendees: 9, summary: 'EC approved the Diwali budget and renewed the CCTV maintenance contract for one year.', decisions: [{ topic: 'Diwali', detail: 'Budget approved; volunteers from each street to coordinate.' }] },
  },
  {
    id: 'm-ec-2026-11', title: 'EC Monthly Meeting — November 2026', type: 'EC Meeting', date: '2026-11-15', time: '7:00 PM', venue: 'Clubhouse', status: 'upcoming',
    agenda: ['September–October balance sheet', 'Water tank cleaning', 'Winter security plan'],
  },
  {
    id: 'm-special-2026-12', title: 'Special Meeting — Clubhouse Renovation', type: 'Special', date: '2026-12-06', time: '11:00 AM', venue: 'Clubhouse', status: 'upcoming',
    agenda: ['Renovation quotes', 'Funding plan'],
  },
]

/* ------------------------------------------------------------------ */
/* Finances / Audit                                                    */
/* ------------------------------------------------------------------ */

export const financialStatements: FinancialStatement[] = [
  {
    id: 'fin-2026-09', title: 'Monthly Balance Sheet — September 2026', period: 'September 2026', category: 'Monthly',
    openingBalance: 420000, income: 96000, expense: 118500, closingBalance: 397500, audited: true, auditor: 'Internal Audit Sub-committee',
    lineItems: [
      { label: 'Balance carried forward', amount: 420000, type: 'income' },
      { label: 'Maintenance collections', amount: 96000, type: 'income' },
      { label: 'Security agency', amount: 65000, type: 'expense' },
      { label: 'Housekeeping', amount: 32000, type: 'expense' },
      { label: 'Common area electricity', amount: 14500, type: 'expense' },
      { label: 'Repairs & sundries', amount: 7000, type: 'expense' },
    ],
  },
  {
    id: 'fin-audit-2025-26', title: 'Annual Audited Accounts 2025–26', period: 'FY 2025–26', category: 'Annual Audit',
    openingBalance: 310000, income: 1490000, expense: 1380000, closingBalance: 420000, audited: true, auditor: 'Example & Co., Chartered Accountants',
    lineItems: [
      { label: 'Maintenance collections', amount: 1400000, type: 'income' },
      { label: 'Clubhouse bookings', amount: 90000, type: 'income' },
      { label: 'Security & housekeeping', amount: 1050000, type: 'expense' },
      { label: 'Electricity & water', amount: 210000, type: 'expense' },
      { label: 'Repairs & admin', amount: 120000, type: 'expense' },
    ],
  },
  {
    id: 'fin-diwali-2026', title: 'Diwali 2026 — Balance Sheet', period: 'October 2026', category: 'Festival',
    income: 85000, expense: 72000, closingBalance: 13000, audited: false,
    lineItems: [
      { label: 'Resident contributions', amount: 85000, type: 'income' },
      { label: 'Lighting & decoration', amount: 30000, type: 'expense' },
      { label: 'Food & refreshments', amount: 28000, type: 'expense' },
      { label: 'Kids events & prizes', amount: 14000, type: 'expense' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Maintenance dues                                                    */
/* ------------------------------------------------------------------ */

const rate = society.annualMaintenance
const seedOwners: [string, string, string, MaintenanceRecord['status'], number][] = [
  ['101', 'A1', 'Anita Sharma', 'paid', 0],
  ['104', 'A1', 'Arjun Mehta', 'paid', 0],
  ['112', 'A2', 'Joseph D’Souza', 'partial', rate / 2],
  ['118', 'A3', 'Meera Iyer', 'paid', 0],
  ['121', 'A3', 'Kavya Reddy', 'due', rate],
  ['205', 'B1', 'Fatima Khan', 'paid', 0],
  ['209', 'B1', 'Sanjay Gupta', 'due', rate * 2],
  ['214', 'B2', 'Rahul Verma', 'paid', 0],
  ['220', 'B2', 'Priya Das', 'partial', rate / 2],
  ['233', 'B3', 'Harpreet Kaur', 'paid', 0],
  ['301', 'C1', 'Vikram Singh', 'paid', 0],
  ['310', 'C2', 'Lakshmi Nair', 'paid', 0],
]

export const maintenanceRecords: MaintenanceRecord[] = seedOwners.map(([plotNo, road, owner, status, dueAmount]) => ({
  plotNo,
  road,
  owner,
  status,
  dueAmount,
  paidAmount: status === 'paid' ? rate : status === 'partial' ? rate - dueAmount : 0,
  lastPaid: status === 'due' ? '2025-04-20' : status === 'partial' ? '2026-06-11' : '2026-04-30',
}))

/** Association-wide totals shown on the dashboard and maintenance page. */
export const maintenanceSummary = {
  ratePerPlot: society.annualMaintenance,
  totalPlots: society.totalPlots,
  paidPlots: 96,
  partialPlots: 10,
  duePlots: 14,
  get collected() {
    return this.paidPlots * society.annualMaintenance + this.partialPlots * (society.annualMaintenance / 2)
  },
  get outstanding() {
    return this.duePlots * society.annualMaintenance + this.partialPlots * (society.annualMaintenance / 2)
  },
}

/* ------------------------------------------------------------------ */
/* Amenities                                                           */
/* ------------------------------------------------------------------ */

export const amenities: Amenity[] = [
  { id: 'a1', name: 'Clubhouse Hall', category: 'Common', location: 'Street A1', description: 'Hall for functions, meetings and celebrations. Seats 120.', status: 'available', bookable: true, timings: '7:00 AM – 10:00 PM' },
  { id: 'a2', name: 'Central Park', category: 'Park', location: 'Street B2', description: 'Walking track, benches and a kids play area.', status: 'available', bookable: false, timings: '5:00 AM – 9:00 PM' },
  { id: 'a3', name: 'Sports Court', category: 'Sports', location: 'Street C1', description: 'Multi-purpose court for badminton and basketball.', status: 'available', bookable: true, timings: '6:00 AM – 10:00 PM' },
  { id: 'a4', name: 'Gym', category: 'Sports', location: 'Clubhouse', description: 'Cardio and weights. Residents only.', status: 'maintenance', bookable: false, timings: '5:30 AM – 9:30 PM' },
  { id: 'a5', name: 'Guest Room', category: 'Common', location: 'Clubhouse', description: 'Two-bed guest room for visiting family.', status: 'available', bookable: true },
  { id: 'a6', name: 'CCTV Surveillance', category: 'Security', location: 'All gates & streets', description: 'Cameras at both gates and every street.', status: 'available', bookable: false, timings: '24×7' },
]

/* ------------------------------------------------------------------ */
/* Rentals                                                             */
/* ------------------------------------------------------------------ */

export const rentals: Rental[] = [
  { id: 'r1', plotNo: '121', road: 'A3', type: 'Independent House', bhk: '3 BHK', rent: 30000, deposit: 100000, furnishing: 'Semi-furnished', area: 1800, available: '2026-12-01', contactName: 'Kavya Reddy', contactPhone: '+91 90000 00121', amenities: ['Car parking', 'Power backup'], status: 'available' },
  { id: 'r2', plotNo: '220', road: 'B2', type: 'Villa', bhk: '4 BHK', rent: 48000, deposit: 200000, furnishing: 'Fully furnished', area: 2600, available: '2026-11-15', contactName: 'Priya Das', contactPhone: '+91 90000 00220', amenities: ['Garden', 'Car + bike parking', 'Solar heater'], status: 'available' },
  { id: 'r3', plotNo: '310', road: 'C2', type: 'Portion', bhk: '1 BHK', rent: 14000, deposit: 40000, furnishing: 'Unfurnished', area: 650, available: '2026-09-01', contactName: 'Lakshmi Nair', contactPhone: '+91 90000 00310', amenities: ['Separate entrance'], status: 'rented' },
]

/* ------------------------------------------------------------------ */
/* Requests / Complaints                                               */
/* ------------------------------------------------------------------ */

export const serviceRequests: ServiceRequest[] = [
  {
    id: 'req-1', ticketNo: `${society.ticketPrefix}-2026-0012`, category: 'water-power', title: 'Street light out on A2',
    description: 'Two street lights near house 112 have been off for three days.',
    plotNo: '112', road: 'A2', raisedBy: 'Joseph D’Souza', raisedOn: '2026-10-20', status: 'resolved', priority: 'low', assignedTo: 'Electrician',
    updates: [
      { on: '2026-10-20', note: 'Reported to society electrician.' },
      { on: '2026-10-21', note: 'Both lights replaced.' },
    ],
  },
  {
    id: 'req-2', ticketNo: `${society.ticketPrefix}-2026-0013`, category: 'drainage', title: 'Blocked drain near the park',
    description: 'Water collects at the B2 park entrance after rain.',
    plotNo: '214', road: 'B2', raisedBy: 'Rahul Verma', raisedOn: '2026-10-24', status: 'in-progress', priority: 'medium', assignedTo: 'Plumbing vendor',
    updates: [
      { on: '2026-10-24', note: 'Ticket raised.' },
      { on: '2026-10-26', note: 'Vendor inspected; cleaning scheduled.' },
    ],
  },
  {
    id: 'req-3', ticketNo: `${society.ticketPrefix}-2026-0014`, category: 'sanitation', title: 'Garbage pickup missed on C1',
    description: 'No pickup on C1 since Monday.',
    plotNo: '301', road: 'C1', raisedBy: 'Vikram Singh', raisedOn: '2026-10-27', status: 'open', priority: 'medium', assignedTo: 'Housekeeping',
    updates: [{ on: '2026-10-27', note: 'Informed housekeeping supervisor.' }],
  },
]

/* ------------------------------------------------------------------ */
/* Announcements (dashboard)                                           */
/* ------------------------------------------------------------------ */

export const announcements = [
  { id: 'an-1', date: '2026-10-25', title: 'Diwali celebrations — thank you', body: 'Thanks to all volunteers and families who joined.', tag: 'Festival' },
  { id: 'an-2', date: '2026-10-05', title: 'Maintenance for 2026–27', body: 'Please clear dues before 31 October.', tag: 'Maintenance' },
]
