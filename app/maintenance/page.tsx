import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { all } from '@/lib/repo'
import { MaintenanceView } from './maintenance-view'
import { society, money } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Maintenance',
  description: `Paid members list and outstanding dues at ${money(society.annualMaintenance)} per ${society.terms.unit.toLowerCase()} per year.`,
}

export default async function MaintenancePage() {
  const records = await all('maintenance')
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Maintenance & Dues"
        description={`Annual maintenance is ${money(society.annualMaintenance)} per ${society.terms.unit.toLowerCase()}, approved at ${society.maintenanceApprovedAt}. Track paid members and outstanding dues across all ${society.terms.blocks}.`}
      />
      <MaintenanceView records={records} />
    </div>
  )
}
