import { marked } from 'marked'

export type MarkdownFrontMatter = Record<string, any>

export type ParsedMarkdown = {
	frontMatter: MarkdownFrontMatter
	body: string
	ast: marked.TokensList
	astHash: string
}

const textEncoder = new TextEncoder()

function splitFrontMatter(source: string) {
	if (!source.trim()) {
		return { frontMatterRaw: '', body: '' }
	}
	const normalized = source.replace(/\r\n/g, '\n')
	if (!normalized.startsWith('---\n')) {
		return { frontMatterRaw: '', body: normalized.trimStart() }
	}
	const endIndex = normalized.indexOf('\n---', 4)
	if (endIndex === -1) {
		return { frontMatterRaw: '', body: normalized.trimStart() }
	}
	const frontMatterRaw = normalized.slice(4, endIndex).trim()
	const body = normalized.slice(endIndex + 4).replace(/^\s*/, '')
	return { frontMatterRaw, body }
}

function parseScalar(input: string): any {
	const trimmed = input.trim()
	if (trimmed === '') return ''
	if (trimmed === 'true') return true
	if (trimmed === 'false') return false
	if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed)
	if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
		return trimmed.slice(1, -1)
	}
	return trimmed
}

function parseFrontMatter(raw: string): MarkdownFrontMatter {
	if (!raw) return {}
	const lines = raw.split(/\n+/)
	const result: MarkdownFrontMatter = {}
	let currentListKey: string | null = null
	for (const line of lines) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#')) continue
		if (trimmed.startsWith('- ')) {
			if (!currentListKey) {
				continue
			}
			const value = trimQuotes(trimmed.slice(2).trim())
			if (!Array.isArray(result[currentListKey])) result[currentListKey] = []
			result[currentListKey] = [...result[currentListKey], parseScalar(value)]
			continue
		}
		const separator = trimmed.indexOf(':')
		if (separator === -1) continue
		const key = trimmed.slice(0, separator).trim()
		const value = trimmed.slice(separator + 1)
		if (value.trim() === '') {
			currentListKey = key
			if (!Array.isArray(result[key])) result[key] = []
			continue
		}
		currentListKey = null
		result[key] = parseScalar(value)
	}
	return result
}

function trimQuotes(value: string) {
	return (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")) ? value.slice(1, -1) : value
}

function stringifyScalar(value: any): string {
	if (value === undefined || value === null) return ''
	if (typeof value === 'string') return value.includes(':') ? `'${value}'` : value
	return String(value)
}

function stringifyFrontMatter(data: MarkdownFrontMatter): string {
	const entries = Object.entries(data || {})
	if (entries.length === 0) return ''
	const parts: string[] = ['---']
	for (const [key, value] of entries) {
		if (Array.isArray(value)) {
			parts.push(`${key}:`)
			for (const item of value) {
				parts.push(`  - ${stringifyScalar(item)}`)
			}
			continue
		}
		parts.push(`${key}: ${stringifyScalar(value)}`.trim())
	}
	parts.push('---', '')
	return parts.join('\n')
}

function normalizeBody(body: string): string {
	if (!body) return ''
	const lines = body.replace(/\r\n/g, '\n').split('\n')
	const normalized: string[] = []
	let blank = false
	for (const line of lines) {
		const trimmed = line.replace(/\s+$/, '')
		if (trimmed.length === 0) {
			if (!blank && normalized.length > 0) normalized.push('')
			blank = true
			continue
		}
		blank = false
		normalized.push(trimmed)
	}
	return normalized.join('\n').trim() + '\n'
}

async function hashTokens(tokens: marked.TokensList): Promise<string> {
	const json = JSON.stringify(tokens)
	if (typeof crypto !== 'undefined' && crypto.subtle) {
		const buffer = textEncoder.encode(json)
		const digest = await crypto.subtle.digest('SHA-256', buffer)
		return Array.from(new Uint8Array(digest))
			.map(byte => byte.toString(16).padStart(2, '0'))
			.join('')
	}
	const { createHash } = await import('node:crypto')
	return createHash('sha256').update(json).digest('hex')
}

export async function parseMarkdownDocument(source: string): Promise<ParsedMarkdown> {
	const { frontMatterRaw, body } = splitFrontMatter(source)
	const frontMatter = parseFrontMatter(frontMatterRaw)
	const normalizedBody = normalizeBody(body)
	const tokens = marked.lexer(normalizedBody)
	const astHash = await hashTokens(tokens)
	return {
		frontMatter,
		body: normalizedBody,
		ast: tokens,
		astHash
	}
}

export async function serializeMarkdownDocument(frontMatter: MarkdownFrontMatter, body: string) {
	const fm = stringifyFrontMatter(frontMatter)
	const normalizedBody = normalizeBody(body)
	const markdown = `${fm}${normalizedBody}`.replace(/\n{3,}/g, '\n\n')
	const { astHash } = await parseMarkdownDocument(markdown)
	return { markdown, astHash }
}

export async function ensureRoundTrip(markdown: string) {
	const parsed = await parseMarkdownDocument(markdown)
	const { markdown: serialized, astHash } = await serializeMarkdownDocument(parsed.frontMatter, parsed.body)
	if (astHash !== parsed.astHash) {
		throw new Error('Markdown round-trip 校验失败，AST 不一致')
	}
	return { markdown: serialized, astHash, frontMatter: parsed.frontMatter, body: parsed.body }
}
