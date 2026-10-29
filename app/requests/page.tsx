import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { all } from '@/lib/repo'
import { RequestsView } from './requests-view'

export const metadata: Metadata = {
  title: 'Requests & Complaints',
  description: 'Raise and track sanitation, drainage, CCTV, water & electricity and road requests.',
}

export default async function RequestsPage() {
  const items = await all('requests')
  return (
    <div>
      <PageHeader
        title="Requests & Complaints"
        description="Raise a ticket for sanitation, drainage, CCTV footage, water & electricity or roads, and track its progress."
      />
      <RequestsView items={items} />
    </div>
  )
}
