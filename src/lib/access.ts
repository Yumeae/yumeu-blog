export async function verifyAccessJWT(jwt: string, aud: string, teamDomain: string): Promise<{ valid: boolean; email?: string; reason?: string }> {
	try {
		const parts = jwt.split('.')
		if (parts.length !== 3) {
			return { valid: false, reason: 'Invalid JWT format' }
		}

		const header = JSON.parse(atob(parts[0]))
		const payload = JSON.parse(atob(parts[1]))

		if (header.alg !== 'RS256') {
			return { valid: false, reason: 'Invalid algorithm' }
		}

		if (payload.aud !== aud) {
			return { valid: false, reason: 'Invalid audience' }
		}

		if (!payload.email) {
			return { valid: false, reason: 'Missing email' }
		}

		const now = Math.floor(Date.now() / 1000)
		if (payload.exp && payload.exp < now) {
			return { valid: false, reason: 'Token expired' }
		}

		return { valid: true, email: payload.email as string }
	} catch (error) {
		return { valid: false, reason: String(error) }
	}
}

export function extractAccessHeaders(request: Request): {
	clientId: string | null
	clientSecret: string | null
	jwt: string | null
} {
	const clientId = request.headers.get('CF-Access-Client-Id')
	const clientSecret = request.headers.get('CF-Access-Client-Secret')
	const jwtCf = request.headers.get('Cf-Access-Jwt-Assertion')

	return {
		clientId,
		clientSecret,
		jwt: jwtCf
	}
}
