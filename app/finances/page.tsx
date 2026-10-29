import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { FinancesView } from './finances-view'
import { society } from '@/society/config'

export const metadata: Metadata = {
  title: 'Finances & Audit',
  description: 'Balance sheets, audit reports, festival and fund accounts.',
}

export default function FinancesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Finances & Audit"
        description={`Audited annual accounts, monthly balance sheets, and transparent festival and fund statements. All figures in ${society.currency}.`}
      />
      <FinancesView />
    </div>
  )
}
