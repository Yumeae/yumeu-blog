import type { NextRequest } from 'next/server'

type EnvCarrier = NextRequest & { cf?: { env?: CloudflareBindings } }

export function getCloudflareEnv(request?: NextRequest | Request): CloudflareBindings {
	if (request) {
		const carrier = request as EnvCarrier
		const cfEnv = carrier?.cf?.env
		if (cfEnv) return cfEnv
	}

	if (typeof globalThis !== 'undefined' && globalThis.__CLOUDFLARE_ENV__) {
		return globalThis.__CLOUDFLARE_ENV__
	}

	throw new Error('Cloudflare bindings 不可用，请确认运行在 Cloudflare 环境并配置 wrangler 绑定')
}

export function getAnalytics(env: CloudflareBindings) {
	return env.WORKERS_ANALYTICS
}

export function getMediaBaseUrl(env: CloudflareBindings): string | undefined {
	return env.MEDIA_PUBLIC_BASE_URL || undefined
}

export function getMediaPrefix(env: CloudflareBindings): string {
	return env.MEDIA_R2_PREFIX || 'media'
}
