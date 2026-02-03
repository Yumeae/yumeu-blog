import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareEnv } from '@/lib/cloudflare-env'
import { requireAccess, AccessDeniedError } from '@/lib/access'
import { getPost, deletePost, savePost, getDraft, type PostStatus } from '@/lib/posts-repository'
import { ensureRoundTrip } from '@/lib/content-parser'
import { sha256 } from '@/lib/hash'
import { recordAnalyticsEvent } from '@/lib/analytics'

export const runtime = 'edge'

type Params = {
	slug: string
}

function normalizeStatus(status?: string): PostStatus {
	if (status === 'scheduled' || status === 'published') return status
	return 'draft'
}

export async function GET(request: NextRequest, context: { params: Params }) {
	try {
		const env = getCloudflareEnv(request)
		requireAccess(request, env)
		const post = await getPost(env, context.params.slug)
		const draft = await getDraft(env, context.params.slug)
		return NextResponse.json({ post, draft })
	} catch (error) {
		if (error instanceof AccessDeniedError) {
			return NextResponse.json({ message: error.message }, { status: 401 })
		}
		console.error(error)
		return NextResponse.json({ message: '获取文章失败' }, { status: 500 })
	}
}

export async function PUT(request: NextRequest, context: { params: Params }) {
	try {
		const env = getCloudflareEnv(request)
		const claims = requireAccess(request, env)
		const payload = (await request.json()) as {
			title: string
			summary?: string
			markdown: string
			tags?: string[]
			heroImageUrl?: string
			status?: PostStatus
			publishedAt?: string
		}
		if (!payload.markdown) {
			return NextResponse.json({ message: 'markdown 内容缺失' }, { status: 400 })
		}
		const roundTrip = await ensureRoundTrip(payload.markdown)
		const frontMatter: Record<string, any> = {
			...roundTrip.frontMatter,
			title: payload.title ?? roundTrip.frontMatter.title,
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
			slug: context.params.slug,
			title: frontMatter.title ?? context.params.slug,
			summary: frontMatter.summary,
			heroImageUrl: frontMatter.heroImageUrl,
			tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
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
		return NextResponse.json({ message: '更新文章失败' }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest, context: { params: Params }) {
	try {
		const env = getCloudflareEnv(request)
		requireAccess(request, env)
		await deletePost(env, context.params.slug)
		await recordAnalyticsEvent(env, 'post-delete', { slug: context.params.slug })
		return NextResponse.json({ deleted: true })
	} catch (error) {
		if (error instanceof AccessDeniedError) {
			return NextResponse.json({ message: error.message }, { status: 401 })
		}
		console.error(error)
		return NextResponse.json({ message: '删除文章失败' }, { status: 500 })
	}
}
