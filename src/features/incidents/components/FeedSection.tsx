import { getProfileName, getUpdates } from '@/lib/queries'
import { ActivityFeed } from './ActivityFeed'

export async function FeedSection({
  incidentId,
  userId,
  userEmail,
}: {
  incidentId: string
  userId: string
  userEmail: string
}) {
  const [updates, name] = await Promise.all([
    getUpdates(incidentId),
    getProfileName(userId, userEmail.split('@')[0]),
  ])

  return (
    <ActivityFeed
      incidentId={incidentId}
      initial={updates}
      currentUserId={userId}
      currentUserName={name}
    />
  )
}
