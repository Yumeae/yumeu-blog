import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareEnv } from '@/lib/cloudflare-env'
import { recordAnalyticsEvent } from '@/lib/analytics'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
	try {
		const env = getCloudflareEnv(request)
		await recordAnalyticsEvent(env, 'posts-refresh-requested', {
			sourceIp: request.headers.get('cf-connecting-ip') || undefined
		})
		return NextResponse.json({ accepted: true }, { status: 202 })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ message: '无法触发刷新' }, { status: 500 })
	}
}
