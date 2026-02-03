import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareEnv } from '@/lib/cloudflare-env'
import { getPost } from '@/lib/posts-repository'
import { recordAnalyticsEvent } from '@/lib/analytics'

export const runtime = 'edge'

type Params = {
	slug: string
}

export async function GET(request: NextRequest, context: { params: Params }) {
	const { slug } = context.params
	try {
		const env = getCloudflareEnv(request)
		const post = await getPost(env, slug)
		if (!post) {
			await recordAnalyticsEvent(env, 'missing-slug', { slug })
			return NextResponse.json(
				{
					code: 'missing-slug',
					requestedSlug: slug,
					timestamp: new Date().toISOString()
				},
				{ status: 404 }
			)
		}
		return NextResponse.json({ post, versionTimestamp: post.versionTimestamp })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ message: '读取文章失败' }, { status: 500 })
	}
}
