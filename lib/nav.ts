import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  ReceiptIndianRupee,
  Landmark,
  Users,
  CalendarClock,
  Map,
  Trees,
  Home,
  Wrench,
  Receipt,
  BookOpenCheck,
  ShieldCheck,
  Megaphone,
  FolderOpen,
  BookUser,
  Vote,
} from 'lucide-react'

export type NavGroup = 'Overview' | 'Money' | 'Community' | 'Living'

export type NavItem = {
  href: string
  label: string
  short: string
  icon: LucideIcon
  description: string
  group: NavGroup
}

export const navGroups: NavGroup[] = ['Overview', 'Money', 'Community', 'Living']

export const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', short: 'Home', icon: LayoutDashboard, description: 'Overview & announcements', group: 'Overview' },
  { href: '/notices', label: 'Notices', short: 'Notices', icon: Megaphone, description: 'Notices & announcements', group: 'Overview' },
  { href: '/requests', label: 'Member Support', short: 'Support', icon: Wrench, description: 'Requests, complaints & feedback', group: 'Overview' },
  { href: '/maintenance', label: 'Maintenance', short: 'Dues', icon: ReceiptIndianRupee, description: 'Paid members & dues', group: 'Money' },
  { href: '/bills', label: 'Maintenance Bills', short: 'Bills', icon: Receipt, description: 'Generate & send bills', group: 'Money' },
  { href: '/accounting', label: 'Accounting', short: 'Accounts', icon: BookOpenCheck, description: 'Income, expenses & ledger', group: 'Money' },
  { href: '/finances', label: 'Finances & Audit', short: 'Finances', icon: Landmark, description: 'Balance sheets & audit reports', group: 'Money' },
  { href: '/committee', label: 'Committee', short: 'Committee', icon: Users, description: 'Executive & Advisory', group: 'Community' },
  { href: '/meetings', label: 'Meetings', short: 'Meetings', icon: CalendarClock, description: 'Held & upcoming, minutes', group: 'Community' },
  { href: '/polls', label: 'Online Polls', short: 'Polls', icon: Vote, description: 'Vote & see results', group: 'Community' },
  { href: '/documents', label: 'Document Library', short: 'Documents', icon: FolderOpen, description: 'Byelaws, minutes & forms', group: 'Community' },
  { href: '/contacts', label: 'Handy Contacts', short: 'Contacts', icon: BookUser, description: 'Call society contacts', group: 'Community' },
  { href: '/visitors', label: 'Visitor Management', short: 'Visitors', icon: ShieldCheck, description: 'Gate log & approvals', group: 'Living' },
  { href: '/amenities', label: 'Amenities', short: 'Amenities', icon: Trees, description: 'Facilities & booking', group: 'Living' },
  { href: '/layout-plan', label: 'Layout Plan', short: 'Map', icon: Map, description: 'Society map & plots', group: 'Living' },
  { href: '/rentals', label: 'Rentals', short: 'Rentals', icon: Home, description: 'Properties for rent', group: 'Living' },
]

// Shown in the mobile bottom bar; everything else lives under "More".
export const mobilePrimaryHrefs = ['/', '/maintenance', '/requests', '/notices']
