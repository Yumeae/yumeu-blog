const encoder = new TextEncoder()

export async function sha256(input: string): Promise<string> {
	if (typeof crypto !== 'undefined' && crypto.subtle) {
		const digest = await crypto.subtle.digest('SHA-256', encoder.encode(input))
		return Array.from(new Uint8Array(digest))
			.map(byte => byte.toString(16).padStart(2, '0'))
			.join('')
	}
	const { createHash } = await import('node:crypto')
	return createHash('sha256').update(input).digest('hex')
}
