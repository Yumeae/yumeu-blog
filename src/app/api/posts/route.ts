import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareEnv } from '@/lib/cloudflare-env'
import { getPostsPayload, type PostSummary } from '@/lib/posts-repository'
import type { BlogIndexItem } from '@/app/blog/types'

export const runtime = 'edge'

const STALE_THRESHOLD_MS = 5 * 60 * 1000

const toBlogIndexItem = (post: PostSummary): BlogIndexItem => ({
	slug: post.slug,
	title: post.title || post.slug,
	summary: post.summary,
	cover: post.heroImageUrl,
	tags: post.tags || [],
	date: post.publishedAt || post.updatedAt,
	hidden: post.status !== 'published'
})

export async function GET(request: NextRequest) {
	try {
		const env = getCloudflareEnv(request)
		const payload = await getPostsPayload(env)
		const stale = Date.now() - payload.versionTimestamp > STALE_THRESHOLD_MS
		return NextResponse.json(
			{
				items: payload.items.filter(item => item.status === 'published').map(toBlogIndexItem),
				versionTimestamp: payload.versionTimestamp,
				generatedAt: payload.generatedAt,
				stale
			},
			{
				headers: {
					'Cache-Control': 'no-store'
				}
			}
		)
	} catch (error) {
		console.error(error)
		return NextResponse.json({ message: '获取文章列表失败' }, { status: 500 })
	}
}
