import { marked } from 'marked'

export function parseMarkdown(content: string): {
	frontMatter: Record<string, unknown>
	markdown: string
} {
	const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
	const match = content.match(frontMatterRegex)

	if (!match) {
		return { frontMatter: {}, markdown: content }
	}

	const frontMatterStr = match[1]
	const markdown = match[2]

	const frontMatter: Record<string, unknown> = {}
	frontMatterStr.split('\n').forEach(line => {
		const colonIndex = line.indexOf(':')
		if (colonIndex === -1) return

		const key = line.slice(0, colonIndex).trim()
		const value = line.slice(colonIndex + 1).trim()

		if (value === 'true' || value === 'false') {
			frontMatter[key] = value === 'true'
		} else if (!isNaN(Number(value))) {
			frontMatter[key] = Number(value)
		} else {
			frontMatter[key] = value.replace(/^["']|["']$/g, '')
		}
	})

	return { frontMatter, markdown }
}

export function renderMarkdown(markdown: string): string {
	return marked(markdown)
}

export function prettyPrintMarkdown(markdown: string): string {
	const lines = markdown.split('\n')
	const result: string[] = []
	let inCodeBlock = false
	let codeBlockFence = ''

	for (const line of lines) {
		if (line.startsWith('```')) {
			if (!inCodeBlock) {
				codeBlockFence = line.slice(0, 3)
				inCodeBlock = true
			} else if (line.startsWith(codeBlockFence)) {
				inCodeBlock = false
				codeBlockFence = ''
			}
			result.push(line)
		} else {
			if (!inCodeBlock) {
				const trimmed = line.trim()
				if (trimmed === '') {
					result.push('')
				} else {
					result.push(line)
				}
			} else {
				result.push(line)
			}
		}
	}

	return result.join('\n')
}
