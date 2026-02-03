import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareEnv, getMediaBaseUrl, getMediaPrefix } from '@/lib/cloudflare-env'
import { requireAccess, AccessDeniedError } from '@/lib/access'
import { recordAnalyticsEvent } from '@/lib/analytics'

export const runtime = 'edge'

function sanitizeFilename(name: string) {
	return name.replace(/[^a-zA-Z0-9._-]/g, '-')
}

export async function POST(request: NextRequest) {
	try {
		const env = getCloudflareEnv(request)
		const claims = requireAccess(request, env)
		const formData = await request.formData()
		const file = formData.get('file')
		if (!(file instanceof File)) {
			return NextResponse.json({ message: '缺少 file 字段' }, { status: 400 })
		}
		const slug = (formData.get('slug') as string) || 'global'
		const arrayBuffer = await file.arrayBuffer()
		const prefix = getMediaPrefix(env)
		const objectKey = `${prefix}/${slug}/${Date.now()}-${sanitizeFilename(file.name)}`
		await env.MEDIA_BUCKET.put(objectKey, arrayBuffer, {
			httpMetadata: { contentType: file.type || 'application/octet-stream' }
		})
		const baseUrl = getMediaBaseUrl(env)
		const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/${objectKey}` : undefined
		await env.CONTENT_KV.put(`media:${objectKey}`, JSON.stringify({
			slug,
			objectKey,
			url,
			uploadedAt: new Date().toISOString(),
			uploadedBy: claims.email || claims.sub || 'unknown'
		}))
		await recordAnalyticsEvent(env, 'media-upload', { slug, hasPublicUrl: Boolean(url) })
		return NextResponse.json({ objectKey, url })
	} catch (error) {
		if (error instanceof AccessDeniedError) {
			return NextResponse.json({ message: error.message }, { status: 401 })
		}
		console.error(error)
		return NextResponse.json({ message: '上传失败' }, { status: 500 })
	}
}
