import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareEnv } from '@/lib/cloudflare-env'
import { requireAccess, AccessDeniedError } from '@/lib/access'
import { saveDraft } from '@/lib/posts-repository'

export const runtime = 'edge'

type Params = {
	slug: string
}

export async function PUT(request: NextRequest, context: { params: Params }) {
	try {
		const env = getCloudflareEnv(request)
		requireAccess(request, env)
		const body = (await request.json()) as { markdown: string; metadata?: Record<string, any> }
		if (!body.markdown) {
			return NextResponse.json({ message: '缺少 markdown 内容' }, { status: 400 })
		}
		await saveDraft(env, context.params.slug, body.markdown, body.metadata || {})
		return NextResponse.json({ saved: true, slug: context.params.slug })
	} catch (error) {
		if (error instanceof AccessDeniedError) {
			return NextResponse.json({ message: error.message }, { status: 401 })
		}
		console.error(error)
		return NextResponse.json({ message: '保存草稿失败' }, { status: 500 })
	}
}
