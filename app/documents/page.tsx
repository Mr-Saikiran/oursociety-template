import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { DocumentsView } from './view'

export const metadata: Metadata = {
  title: 'Document Library',
  description: 'Byelaws, minutes, financial statements, forms and certificates in one place.',
}

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Document Library" description="Byelaws, minutes, financial statements, forms and certificates in one place." />
      <DocumentsView />
    </div>
  )
}
