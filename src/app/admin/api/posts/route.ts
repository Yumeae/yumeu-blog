import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareEnv } from '@/lib/cloudflare-env'
import { requireAccess, AccessDeniedError } from '@/lib/access'
import { ensureRoundTrip } from '@/lib/content-parser'
import { savePost, type PostStatus } from '@/lib/posts-repository'
import { recordAnalyticsEvent } from '@/lib/analytics'
import { sha256 } from '@/lib/hash'

export const runtime = 'edge'

type AdminPostPayload = {
	slug: string
	title: string
	summary?: string
	markdown: string
	tags?: string[]
	heroImageUrl?: string
	status?: PostStatus
	publishedAt?: string
}

function normalizeStatus(status?: string): PostStatus {
	if (status === 'scheduled' || status === 'published') return status
	return 'draft'
}

export async function POST(request: NextRequest) {
	try {
		const env = getCloudflareEnv(request)
		const claims = requireAccess(request, env)
		const payload = (await request.json()) as AdminPostPayload
		if (!payload.slug || !payload.slug.trim()) {
			return NextResponse.json({ message: 'slug 必填' }, { status: 400 })
		}
		if (!payload.title) {
			return NextResponse.json({ message: 'title 必填' }, { status: 400 })
		}
		if (!payload.markdown) {
			return NextResponse.json({ message: 'markdown 内容缺失' }, { status: 400 })
		}
		const roundTrip = await ensureRoundTrip(payload.markdown)
		const frontMatter: Record<string, any> = {
			...roundTrip.frontMatter,
			title: payload.title,
			summary: payload.summary ?? roundTrip.frontMatter.summary,
			tags: Array.isArray(payload.tags) ? payload.tags : roundTrip.frontMatter.tags || [],
			heroImageUrl: payload.heroImageUrl ?? roundTrip.frontMatter.heroImageUrl,
			status: normalizeStatus(payload.status),
			publishedAt: payload.publishedAt ?? roundTrip.frontMatter.publishedAt,
			date: payload.publishedAt ?? roundTrip.frontMatter.date
		}
		if (!frontMatter.date) {
			frontMatter.date = frontMatter.publishedAt || new Date().toISOString()
		}
		if (!frontMatter.cover && frontMatter.heroImageUrl) {
			frontMatter.cover = frontMatter.heroImageUrl
		}
		const diffHash = await sha256(roundTrip.markdown)
		const record = await savePost(env, {
			slug: payload.slug,
			title: payload.title,
			summary: payload.summary,
			heroImageUrl: payload.heroImageUrl,
			tags: Array.isArray(payload.tags) ? payload.tags : [],
			status: frontMatter.status,
			markdown: roundTrip.markdown,
			frontMatter,
			astHash: roundTrip.astHash,
			publishedAt: frontMatter.publishedAt,
			author: (claims.email as string) || claims.sub || 'unknown',
			diffHash
		})
		await recordAnalyticsEvent(env, 'post-upsert', {
			slug: record.slug,
			status: record.status
		})
		return NextResponse.json({ post: record })
	} catch (error) {
		if (error instanceof AccessDeniedError) {
			return NextResponse.json({ message: error.message }, { status: 401 })
		}
		console.error(error)
		return NextResponse.json({ message: '保存文章失败' }, { status: 500 })
	}
}
