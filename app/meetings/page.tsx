import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { MeetingsView } from './meetings-view'

export const metadata: Metadata = {
  title: 'Meetings',
  description: 'Held and upcoming meetings with minutes of meeting (MOM).',
}

export default function MeetingsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Meetings"
        description="Annual general body meetings, EC monthly meetings and special meetings. Open any held meeting to read the full minutes (MOM)."
      />
      <MeetingsView />
    </div>
  )
}
