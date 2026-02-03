export type PostStatus = 'draft' | 'scheduled' | 'published'

export type PostSummary = {
	slug: string
	title: string
	summary?: string
	heroImageUrl?: string
	tags: string[]
	publishedAt?: string
	status: PostStatus
	updatedAt: string
	author?: string
}

export type PostRecord = PostSummary & {
	markdown: string
	frontMatter: Record<string, any>
	astHash: string
	versionTimestamp: number
}

export type PostsPayload = {
	items: PostSummary[]
	versionTimestamp: number
	generatedAt: number
}

const POSTS_INDEX_KEY = 'posts:index'
const POSTS_VERSION_KEY = 'posts:version'
const POST_KEY_PREFIX = 'post:'
const DRAFT_KEY_PREFIX = 'draft:'
const AUDIT_PREFIX = 'audit:'

type PostsIndex = {
	versionTimestamp: number
	items: PostSummary[]
}

export async function getPostsIndex(env: CloudflareBindings): Promise<PostsIndex> {
	const index = (await env.CONTENT_KV.get(POSTS_INDEX_KEY, { type: 'json' })) as PostsIndex | null
	if (index && Array.isArray(index.items)) {
		return index
	}
	return { versionTimestamp: Date.now(), items: [] }
}

export async function getPost(env: CloudflareBindings, slug: string): Promise<PostRecord | null> {
	const raw = await env.CONTENT_KV.get(POST_KEY_PREFIX + slug, { type: 'json' })
	if (!raw) return null
	return raw as PostRecord
}

async function persistIndex(env: CloudflareBindings, items: PostSummary[], versionTimestamp: number) {
	const sorted = [...items].sort((a, b) => {
		const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
		const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
		return bTime - aTime
	})
	const payload: PostsIndex = { versionTimestamp, items: sorted }
	await env.CONTENT_KV.put(POSTS_INDEX_KEY, JSON.stringify(payload))
}

type SavePostInput = {
	slug: string
	title: string
	summary?: string
	heroImageUrl?: string
	tags?: string[]
	publishedAt?: string
	status: PostStatus
	markdown: string
	frontMatter: Record<string, any>
	astHash: string
	author?: string
	diffHash?: string
}

export async function savePost(env: CloudflareBindings, input: SavePostInput): Promise<PostRecord> {
	const timestamp = new Date().toISOString()
	const versionTimestamp = Date.now()
	const publishedAt = input.status === 'published' ? input.publishedAt || timestamp : input.publishedAt
	const record: PostRecord = {
		slug: input.slug,
		title: input.title,
		summary: input.summary,
		heroImageUrl: input.heroImageUrl,
		tags: input.tags || [],
		status: input.status,
		markdown: input.markdown,
		frontMatter: input.frontMatter,
		astHash: input.astHash,
		publishedAt: publishedAt || undefined,
		updatedAt: timestamp,
		versionTimestamp,
		author: input.author
	}

	await env.CONTENT_KV.put(POST_KEY_PREFIX + input.slug, JSON.stringify(record))

	const currentIndex = await getPostsIndex(env)
	const filtered = currentIndex.items.filter(item => item.slug !== input.slug)
	filtered.push({
		slug: record.slug,
		title: record.title,
		summary: record.summary,
		heroImageUrl: record.heroImageUrl,
		tags: record.tags,
		status: record.status,
		updatedAt: record.updatedAt,
		publishedAt: record.publishedAt,
		author: record.author
	})
	await persistIndex(env, filtered, versionTimestamp)
	await env.CONTENT_KV.put(POSTS_VERSION_KEY, versionTimestamp.toString())
	await env.CONTENT_KV.put(`${AUDIT_PREFIX}${versionTimestamp}:${record.slug}`, JSON.stringify({
		slug: record.slug,
		author: record.author,
		diffHash: input.diffHash,
		status: record.status,
		versionTimestamp
	}))
	return record
}

export async function deletePost(env: CloudflareBindings, slug: string) {
	await env.CONTENT_KV.delete(POST_KEY_PREFIX + slug)
	const currentIndex = await getPostsIndex(env)
	const filtered = currentIndex.items.filter(item => item.slug !== slug)
	const versionTimestamp = Date.now()
	await persistIndex(env, filtered, versionTimestamp)
	await env.CONTENT_KV.put(POSTS_VERSION_KEY, versionTimestamp.toString())
}

export async function getVersionTimestamp(env: CloudflareBindings): Promise<number> {
	const raw = await env.CONTENT_KV.get(POSTS_VERSION_KEY)
	return raw ? Number(raw) : Date.now()
}

export async function getPostsPayload(env: CloudflareBindings): Promise<PostsPayload> {
	const index = await getPostsIndex(env)
	return {
		items: index.items,
		versionTimestamp: index.versionTimestamp,
		generatedAt: Date.now()
	}
}

export async function saveDraft(env: CloudflareBindings, slug: string, markdown: string, metadata: Record<string, any>) {
	const payload = {
		markdown,
		metadata,
		savedAt: new Date().toISOString()
	}
	await env.CONTENT_KV.put(DRAFT_KEY_PREFIX + slug, JSON.stringify(payload))
}

export async function getDraft(env: CloudflareBindings, slug: string) {
	return (await env.CONTENT_KV.get(DRAFT_KEY_PREFIX + slug, { type: 'json' })) as { markdown: string; metadata: Record<string, any>; savedAt: string } | null
}
