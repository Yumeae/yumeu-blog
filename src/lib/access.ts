import type { NextRequest } from 'next/server'

declare const Buffer: undefined | { from(input: string, encoding: string): { toString(encoding?: string): string } }

type JwtClaims = {
	iss?: string
	aud?: string | string[]
	exp?: number
	sub?: string
	email?: string
	[n: string]: unknown
}

export class AccessDeniedError extends Error {
	status = 401
	constructor(message: string) {
		super(message)
		this.name = 'AccessDeniedError'
	}
}

function decodeBase64Url(input: string): string {
	const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
	const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
	if (typeof atob === 'function') {
		return atob(padded)
	}
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(padded, 'base64').toString('utf-8')
	}
	throw new AccessDeniedError('当前运行时不支持 Base64 解码')
}

function decodeJwt(token: string): JwtClaims {
	const [, payload] = token.split('.')
	if (!payload) throw new AccessDeniedError('Access token 结构异常')
	try {
		return JSON.parse(decodeBase64Url(payload)) as JwtClaims
	} catch (error) {
		throw new AccessDeniedError(`无法解析 Access token: ${(error as Error).message}`)
	}
}

function normalizeAud(aud?: string | string[]): string[] {
	if (!aud) return []
	return Array.isArray(aud) ? aud : [aud]
}

export function requireAccess(request: NextRequest | Request, env: CloudflareBindings): JwtClaims {
	const header = request.headers.get('CF-Access-Jwt-Assertion') || request.headers.get('cf-access-jwt-assertion')
	if (!header) {
		throw new AccessDeniedError('缺少 Cloudflare Access 凭证')
	}
	const claims = decodeJwt(header)
	const nowSec = Math.floor(Date.now() / 1000)
	if (typeof claims.exp === 'number' && claims.exp < nowSec) {
		throw new AccessDeniedError('Access token 已过期')
	}
	const expectedAud = env.ACCESS_AUD
	const allowedAudience = normalizeAud(claims.aud)
	if (expectedAud && !allowedAudience.includes(expectedAud)) {
		throw new AccessDeniedError('Access token aud 不匹配')
	}
	if (env.ACCESS_EMAIL_ALLOWLIST) {
		const allowList = env.ACCESS_EMAIL_ALLOWLIST.split(',').map(item => item.trim().toLowerCase()).filter(Boolean)
		const email = (claims.email || '').toLowerCase()
		if (!email || (allowList.length > 0 && !allowList.includes(email))) {
			throw new AccessDeniedError('当前账号未在允许列表中')
		}
	}
	return claims
}
