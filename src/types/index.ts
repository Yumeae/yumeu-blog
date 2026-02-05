export interface Env {
	CONTENT_KV: KVNamespace
	MEDIA_BUCKET: R2Bucket
	WORKERS_ANALYTICS: AnalyticsEngineDataset
	ACCESS_AUD: string
	ACCESS_TEAM_DOMAIN: string
	ACCESS_EMAIL_ALLOWLIST: string
	MEDIA_PUBLIC_BASE_URL: string
	MEDIA_R2_PREFIX: string
}

export interface Post {
	slug: string
	title: string
	description: string
	content: string
	publishedAt: string
	updatedAt: string
	status: 'draft' | 'published'
	heroImageUrl?: string
	author?: string
}

export interface PostIndex {
	posts: Post[]
	versionTimestamp: number
	stale: boolean
}

export interface MediaUploadResult {
	url: string
	key: string
	size: number
	contentType: string
}

export interface AnalyticsEvent {
	timestamp: number
	event: string
	data: Record<string, unknown>
}
