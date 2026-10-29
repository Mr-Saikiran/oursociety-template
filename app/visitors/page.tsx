import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { all } from '@/lib/repo'
import { VisitorsView } from './view'

export const metadata: Metadata = {
  title: 'Visitor Management',
  description: 'Verify every visitor with residents before they enter the premises.',
}

export default async function Page() {
  const items = await all('visitors')
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Visitor Management" description="Verify every visitor with residents before they enter the premises." />
      <VisitorsView items={items} />
    </div>
  )
}
