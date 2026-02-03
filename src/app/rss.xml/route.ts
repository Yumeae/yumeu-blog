import siteContent from '@/config/site-content.json'
import type { BlogIndexItem } from '@/app/blog/types'
import { getCloudflareEnv } from '@/lib/cloudflare-env'
import { getPostsPayload, type PostSummary } from '@/lib/posts-repository'
import type { NextRequest } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yysuni.com'
const FEED_PATH = '/rss.xml'
const SITE_ORIGIN = SITE_URL.replace(/\/$/, '')
const FEED_URL = `${SITE_ORIGIN}${FEED_PATH}`

const escapeXml = (value: string): string =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const wrapCdata = (value: string): string => `<![CDATA[${value}]]>`

const getExtension = (input: string): string | undefined => {
	const clean = input.split(/[?#]/)[0]
	return clean.split('.').pop()?.toLowerCase()
}

const getMimeTypeFromUrl = (url?: string): string | null => {
	if (!url) return null
	const ext = getExtension(url)
	if (!ext) return null
	if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
	if (ext === 'png') return 'image/png'
	if (ext === 'gif') return 'image/gif'
	if (ext === 'webp') return 'image/webp'
	if (ext === 'svg') return 'image/svg+xml'
	return null
}

const buildEnclosure = (cover?: string): string | null => {
	if (!cover) return null
	const absoluteUrl = /^https?:\/\//.test(cover) ? cover : `${SITE_ORIGIN}${cover}`
	const type = getMimeTypeFromUrl(absoluteUrl)
	if (!type) return null
	return `<enclosure url="${escapeXml(absoluteUrl)}" type="${type}" />`
}

const serializeItem = (item: BlogIndexItem): string => {
	const link = `${SITE_ORIGIN}/blog/${item.slug}`
	const title = escapeXml(item.title || item.slug)
	const description = wrapCdata(item.summary || '')
	const pubDate = new Date(item.date).toUTCString()
	const categories = (item.tags || [])
		.filter(Boolean)
		.map(tag => `<category>${escapeXml(tag)}</category>`)
		.join('')

	const enclosure = buildEnclosure(item.cover)

	return `
		<item>
			<title>${title}</title>
			<link>${link}</link>
			<guid isPermaLink="false">${escapeXml(link)}</guid>
			<description>${description}</description>
			<pubDate>${pubDate}</pubDate>
			${categories}
			${enclosure ?? ''}
		</item>`.trim()
}

export const runtime = 'edge'

const mapPostToBlogIndex = (post: PostSummary): BlogIndexItem => ({
	slug: post.slug,
	title: post.title || post.slug,
	summary: post.summary,
	cover: post.heroImageUrl,
	tags: post.tags || [],
	date: post.publishedAt || post.updatedAt,
	hidden: post.status !== 'published'
})

export async function GET(request: NextRequest): Promise<Response> {
	const title = siteContent.meta?.title || '2025 Blog'
	const description = siteContent.meta?.description || 'Latest updates from 2025 Blog'
	const env = getCloudflareEnv(request)
	const payload = await getPostsPayload(env)
	const blogs = payload.items.filter(item => item.status === 'published').map(mapPostToBlogIndex)
	const items = blogs
		.filter(item => item?.slug)
		.map(serializeItem)
		.join('')

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel xmlns:atom="http://www.w3.org/2005/Atom">
		<title>${escapeXml(title)}</title>
		<link>${SITE_ORIGIN}</link>
		<atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
		<description>${escapeXml(description)}</description>
		<language>zh-CN</language>
		<docs>https://www.rssboard.org/rss-specification</docs>
		<ttl>60</ttl>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		${items}
	</channel>
</rss>`

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, must-revalidate'
		}
	})
}
