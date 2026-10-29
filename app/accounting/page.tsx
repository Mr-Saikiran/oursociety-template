import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { all } from '@/lib/repo'
import { AccountingView } from './view'

export const metadata: Metadata = {
  title: 'Accounting',
  description: 'Society income, expenses and ledger, from billing to year-end statements.',
}

export default async function Page() {
  const entries = await all('ledger')
  return (
    <div>
      <PageHeader title="Accounting" description="Society income, expenses and ledger, from billing to year-end statements." />
      <AccountingView entries={entries} />
    </div>
  )
}
