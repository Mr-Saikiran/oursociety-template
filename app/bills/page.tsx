import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { all } from '@/lib/repo'
import { BillsView } from './view'

export const metadata: Metadata = {
  title: 'Maintenance Bills',
  description: 'Generate bills for any billing frequency and send them to members by SMS or email.',
}

export default async function Page() {
  const [records, runs] = await Promise.all([all('maintenance'), all('bills')])
  return (
    <div>
      <PageHeader title="Maintenance Bills" description="Generate bills for any billing frequency and send them to members by SMS or email." />
      <BillsView records={records} runs={runs} />
    </div>
  )
}
