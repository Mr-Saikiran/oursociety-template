// Seed data for accounting, visitors, notices, documents, contacts and polls.
// All of it is made up for the demo community; replace it with your own.
import type { Contact, LedgerEntry, Notice, Poll, SocietyDocument, Visitor } from '@/lib/types'

/* ---------------------------- Accounting ---------------------------- */

export const ledger: LedgerEntry[] = [
  { id: 'l1', date: '2026-10-26', type: 'income', category: 'Maintenance', description: 'Maintenance 2026–27 (batch 6)', amount: 72000, mode: 'UPI' },
  { id: 'l2', date: '2026-10-25', type: 'expense', category: 'Security', description: 'Security agency — October invoice', amount: 65000, mode: 'Bank transfer' },
  { id: 'l3', date: '2026-10-22', type: 'expense', category: 'Housekeeping', description: 'Housekeeping — October', amount: 32000, mode: 'Bank transfer' },
  { id: 'l4', date: '2026-10-18', type: 'expense', category: 'Electricity', description: 'Common area electricity', amount: 14500, mode: 'Bank transfer' },
  { id: 'l5', date: '2026-10-12', type: 'income', category: 'Rent of common area', description: 'Clubhouse booking', amount: 8000, mode: 'UPI' },
  { id: 'l6', date: '2026-10-08', type: 'expense', category: 'Repairs', description: 'Street light replacement — A2', amount: 3200, mode: 'Cash' },
]

/* ----------------------------- Visitors ----------------------------- */

export const visitors: Visitor[] = [
  { id: 'v1', name: 'Courier delivery', phone: '+91 90000 11111', purpose: 'Delivery', visiting: 'House 104, A1', resident: 'Arjun Mehta', expectedAt: '2026-10-29 16:00', status: 'pending' },
  { id: 'v2', name: 'Ravi (Plumber)', phone: '+91 90000 22222', purpose: 'Service', visiting: 'House 214, B2', resident: 'Rahul Verma', expectedAt: '2026-10-29 11:00', status: 'inside' },
  { id: 'v3', name: 'Neha Kapoor', phone: '+91 90000 33333', purpose: 'Guest', visiting: 'House 205, B1', resident: 'Fatima Khan', expectedAt: '2026-10-28 19:30', status: 'exited' },
  { id: 'v4', name: 'Cab DL01 AB 0000', phone: '+91 90000 44444', purpose: 'Cab', visiting: 'House 118, A3', resident: 'Meera Iyer', expectedAt: '2026-10-28 08:15', status: 'exited' },
]

/* ----------------------------- Notices ------------------------------ */

export const notices: Notice[] = [
  { id: 'n1', title: 'Water tank cleaning on 2 November', body: 'Water supply will be off from 10 AM to 2 PM while the overhead tanks are cleaned.', date: '2026-10-27', audience: 'all', audienceLabel: 'All members', category: 'Maintenance', attachments: [] },
  { id: 'n2', title: 'Power shutdown — Street C2', body: 'Planned shutdown from 11 AM to 1 PM on 30 October for cable work.', date: '2026-10-24', audience: 'unit', audienceLabel: 'Street C2', category: 'Urgent', attachments: [] },
  { id: 'n3', title: 'Maintenance for 2026–27 due by 31 October', body: 'Pay by UPI or bank transfer. Receipts are issued within 3 working days.', date: '2026-10-05', audience: 'all', audienceLabel: 'All members', category: 'Maintenance', attachments: ['Payment_Instructions.pdf'] },
]

/* ---------------------------- Documents ----------------------------- */

export const documents: SocietyDocument[] = [
  { id: 'd1', name: 'Society Byelaws', category: 'Byelaws', date: '2020-06-01', size: '320 KB', type: 'PDF' },
  { id: 'd2', name: 'Minutes of AGM — 12 April 2026', category: 'Minutes', date: '2026-04-12', size: '180 KB', type: 'PDF' },
  { id: 'd3', name: 'Balance Sheet — September 2026', category: 'Financial', date: '2026-09-30', size: '120 KB', type: 'PDF' },
  { id: 'd4', name: 'Society registration certificate', category: 'Certificates', date: '2020-06-01', size: '400 KB', type: 'PDF' },
  { id: 'd5', name: 'Tenant registration form', category: 'Forms', date: '2026-01-10', size: '60 KB', type: 'DOCX' },
]

/* ----------------------------- Contacts ----------------------------- */

export const contacts: Contact[] = [
  { id: 'c1', name: 'Anita Sharma', role: 'President', phone: '+91 90000 00001', group: 'Committee' },
  { id: 'c2', name: 'Rahul Verma', role: 'Secretary', phone: '+91 90000 00002', group: 'Committee' },
  { id: 'c3', name: 'Meera Iyer', role: 'Treasurer', phone: '+91 90000 00003', group: 'Committee' },
  { id: 'c4', name: 'Main gate security', role: 'Security (24×7)', phone: '+91 90000 10001', group: 'Staff' },
  { id: 'c5', name: 'Society electrician', role: 'Electrical', phone: '+91 90000 10002', group: 'Staff' },
  { id: 'c6', name: 'Police', role: 'Emergency', phone: '112', group: 'Emergency' },
  { id: 'c7', name: 'Ambulance', role: 'Emergency', phone: '108', group: 'Emergency' },
  { id: 'c8', name: 'Fire', role: 'Emergency', phone: '101', group: 'Emergency' },
  { id: 'c9', name: 'Water tanker supplier', role: 'Water', phone: '+91 90000 20001', group: 'Vendors' },
  { id: 'c10', name: 'Electricity board helpline', role: 'Electricity', phone: '1912', group: 'Authorities' },
]

/* ------------------------------ Polls ------------------------------- */

export const polls: Poll[] = [
  {
    id: 'p1', question: 'Which clubhouse renovation should come first?', description: 'To be discussed at the special meeting on 6 December.', closes: '2026-12-05',
    options: [{ id: 'a', label: 'New flooring', votes: 21 }, { id: 'b', label: 'Air conditioning', votes: 34 }, { id: 'c', label: 'Kitchen upgrade', votes: 9 }],
  },
  {
    id: 'p2', question: 'Add a second security guard at night?', description: 'Would add about ₹1,000 per house per year.', closes: '2027-01-15',
    options: [{ id: 'a', label: 'Yes', votes: 40 }, { id: 'b', label: 'No', votes: 18 }],
  },
]
