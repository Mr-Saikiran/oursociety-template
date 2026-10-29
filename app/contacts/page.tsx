import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { ContactsView } from './view'

export const metadata: Metadata = {
  title: 'Handy Contacts',
  description: 'Society contacts you can call directly, without saving them on your phone.',
}

export default function Page() {
  return (
    <div>
      <PageHeader title="Handy Contacts" description="Society contacts you can call directly, without saving them on your phone." />
      <ContactsView />
    </div>
  )
}
