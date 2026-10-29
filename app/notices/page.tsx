import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { all } from '@/lib/repo'
import { NoticesView } from './view'
import { society } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Notices & Announcements',
  description: `Public or ${society.terms.block.toLowerCase()}-specific notices with attachments, emailed to applicable members.`,
}

export default async function Page() {
  const items = await all('notices')
  return (
    <div>
      <PageHeader title="Notices & Announcements" description={`Public or ${society.terms.block.toLowerCase()}-specific notices with attachments, emailed to applicable members.`} />
      <NoticesView items={items} />
    </div>
  )
}
