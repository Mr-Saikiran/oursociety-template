import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { getCurrentUser } from '@/lib/auth'
import { all, publicPoll } from '@/lib/repo'
import { PollsView } from './view'

export const metadata: Metadata = {
  title: 'Online Polls',
  description: 'Let every voice count. Vote once per poll and see live results.',
}

export default async function Page() {
  const [polls, user] = await Promise.all([all('polls'), getCurrentUser()])
  const today = new Date().toISOString().slice(0, 10)
  return (
    <div>
      <PageHeader title="Online Polls" description="Let every voice count. Vote once per poll and see live results." />
      <PollsView polls={polls.map((x) => publicPoll(x, user?.id))} today={today} />
    </div>
  )
}
