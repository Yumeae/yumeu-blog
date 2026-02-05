import type { Env, AnalyticsEvent } from '@/types'

export async function writeAnalyticsEvent(env: Env, event: AnalyticsEvent): Promise<void> {
	try {
		await env.WORKERS_ANALYTICS.writeDataPoint({
			doubles: [],
			blobs: [event.event],
			indexes: [event.timestamp]
		})
	} catch (error) {
		console.error('Failed to write analytics event:', error)
	}
}

export function createAnalyticsEvent(event: string, data: Record<string, unknown>): AnalyticsEvent {
	return {
		timestamp: Date.now(),
		event,
		data
	}
}

export const AnalyticsEvents = {
	MISSING_SLUG: 'missing-slug',
	PUBLISH: 'publish',
	DELETE: 'delete',
	MEDIA_UPLOAD: 'media-upload',
	ACCESS_DENIED: 'access-denied',
	POST_REFRESH: 'post-refresh'
} as const
