import type { Env, Post, PostIndex, MediaUploadResult } from '@/types'

export async function getPostIndex(env: Env): Promise<PostIndex> {
	const indexKey = 'posts:index'
	const indexData = await env.CONTENT_KV.get(indexKey, 'json')

	if (!indexData) {
		return { posts: [], versionTimestamp: Date.now(), stale: false }
	}

	const posts = indexData as Post[]
	const versionTimestampKey = 'version:timestamp'
	const versionTimestamp = await env.CONTENT_KV.get(versionTimestampKey)
	const timestamp = versionTimestamp ? parseInt(versionTimestamp, 10) : Date.now()
	const stale = Date.now() - timestamp > 5 * 60 * 1000

	return { posts, versionTimestamp: timestamp, stale }
}

export async function getPost(env: Env, slug: string): Promise<Post | null> {
	const key = `post:${slug}`
	const data = await env.CONTENT_KV.get(key, 'json')

	return data as Post | null
}

export async function savePost(env: Env, post: Post): Promise<void> {
	const key = `post:${post.slug}`
	await env.CONTENT_KV.put(key, JSON.stringify(post))

	const indexKey = 'posts:index'
	const indexData = await env.CONTENT_KV.get(indexKey, 'json')
	const posts = (indexData as Post[]) || []

	const existingIndex = posts.findIndex(p => p.slug === post.slug)
	if (existingIndex >= 0) {
		posts[existingIndex] = post
	} else {
		posts.push(post)
	}

	posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

	await env.CONTENT_KV.put(indexKey, JSON.stringify(posts))
	await env.CONTENT_KV.put('version:timestamp', String(Date.now()))
}

export async function deletePost(env: Env, slug: string): Promise<void> {
	const key = `post:${slug}`
	await env.CONTENT_KV.delete(key)

	const indexKey = 'posts:index'
	const indexData = await env.CONTENT_KV.get(indexKey, 'json')
	const posts = (indexData as Post[]) || []

	const filtered = posts.filter(p => p.slug !== slug)
	await env.CONTENT_KV.put(indexKey, JSON.stringify(filtered))
	await env.CONTENT_KV.put('version:timestamp', String(Date.now()))
}

export async function uploadMedia(env: Env, slug: string, file: File): Promise<MediaUploadResult> {
	const prefix = env.MEDIA_R2_PREFIX || 'media'
	const key = `${prefix}/${Date.now()}-${slug}-${file.name}`

	await env.MEDIA_BUCKET.put(key, file)

	const baseUrl = env.MEDIA_PUBLIC_BASE_URL
	const url = `${baseUrl}/${key}`

	const metadataKey = `media:${key}`
	const metadata = {
		key,
		url,
		size: file.size,
		contentType: file.type,
		uploadedAt: new Date().toISOString()
	}

	await env.CONTENT_KV.put(metadataKey, JSON.stringify(metadata))

	return {
		url,
		key,
		size: file.size,
		contentType: file.type
	}
}
