import type { Env } from '@/types'
import { getPostIndex, getPost, savePost, deletePost, uploadMedia } from '@/lib/kv-store'
import { verifyAccessJWT, extractAccessHeaders } from '@/lib/access'
import { writeAnalyticsEvent, createAnalyticsEvent, AnalyticsEvents } from '@/lib/analytics'
import { parseMarkdown, prettyPrintMarkdown, renderMarkdown } from '@/lib/markdown'
import type { Post } from '@/types'

export interface RequestWithEnv extends Request {
	env: Env
}

export async function handleRequest(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url)
	const pathname = url.pathname

	if (pathname === '/api/posts') {
		return handleGetPosts(request, env)
	}

	if (pathname.startsWith('/api/posts/')) {
		const slug = pathname.split('/').pop()
		if (slug === 'refresh' && request.method === 'POST') {
			return handleRefreshPosts(request, env)
		}
		if (slug && slug !== 'refresh') {
			return handleGetPost(request, env, slug)
		}
	}

	if (pathname === '/admin/api/posts' && request.method === 'POST') {
		return handleCreatePost(request, env)
	}

	if (pathname.match(/^\/admin\/api\/posts\/[^/]+$/)) {
		const slug = pathname.split('/').pop()
		if (slug) {
			if (request.method === 'PUT') {
				return handleUpdatePost(request, env, slug)
			}
			if (request.method === 'DELETE') {
				return handleDeletePost(request, env, slug)
			}
		}
	}

	if (pathname === '/admin/api/media' && request.method === 'POST') {
		return handleUploadMedia(request, env)
	}

	return new Response('Not Found', { status: 404 })
}

async function handleGetPosts(request: Request, env: Env): Promise<Response> {
	try {
		const index = await getPostIndex(env)
		return Response.json(index)
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
	}
}

async function handleGetPost(request: Request, env: Env, slug: string): Promise<Response> {
	try {
		const post = await getPost(env, slug)

		if (!post) {
			await writeAnalyticsEvent(env, createAnalyticsEvent(AnalyticsEvents.MISSING_SLUG, { requestedSlug: slug }))
			return new Response(
				JSON.stringify({
					code: 'missing-slug',
					requestedSlug: slug,
					timestamp: Date.now()
				}),
				{ status: 404 }
			)
		}

		return Response.json(post)
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
	}
}

async function handleRefreshPosts(request: Request, env: Env): Promise<Response> {
	try {
		await writeAnalyticsEvent(env, createAnalyticsEvent(AnalyticsEvents.POST_REFRESH, { source: 'frontend' }))
		return new Response('Accepted', { status: 202 })
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
	}
}

async function verifyAccess(request: Request, env: Env): Promise<{ email: string } | null> {
	const { jwt } = extractAccessHeaders(request)

	if (!jwt) {
		return null
	}

	const result = await verifyAccessJWT(jwt, env.ACCESS_AUD, env.ACCESS_TEAM_DOMAIN)

	if (!result.valid || !result.email) {
		return null
	}

	const allowlist = env.ACCESS_EMAIL_ALLOWLIST.split(',').map(e => e.trim())
	if (allowlist.length > 0 && !allowlist.includes(result.email)) {
		return null
	}

	return { email: result.email }
}

async function handleCreatePost(request: Request, env: Env): Promise<Response> {
	const user = await verifyAccess(request, env)

	if (!user) {
		await writeAnalyticsEvent(
			env,
			createAnalyticsEvent(AnalyticsEvents.ACCESS_DENIED, {
				reason: 'unauthorized',
				endpoint: '/admin/api/posts'
			})
		)
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		const body = await request.json()
		const { title, description, content, heroImageUrl } = body

		if (!title || !content) {
			return new Response('Missing required fields', { status: 400 })
		}

		const slug = body.slug || generateSlug(title)
		const now = new Date().toISOString()

		const parsed = parseMarkdown(content)
		const prettyContent = prettyPrintMarkdown(content)

		const post: Post = {
			slug,
			title,
			description: description || '',
			content: prettyContent,
			publishedAt: now,
			updatedAt: now,
			status: 'published',
			heroImageUrl,
			author: user.email
		}

		await savePost(env, post)
		await writeAnalyticsEvent(
			env,
			createAnalyticsEvent(AnalyticsEvents.PUBLISH, {
				slug,
				author: user.email
			})
		)

		return Response.json(post)
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
	}
}

async function handleUpdatePost(request: Request, env: Env, slug: string): Promise<Response> {
	const user = await verifyAccess(request, env)

	if (!user) {
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		const body = await request.json()
		const existing = await getPost(env, slug)

		if (!existing) {
			return new Response('Post not found', { status: 404 })
		}

		const parsed = parseMarkdown(body.content || existing.content)
		const prettyContent = body.content ? prettyPrintMarkdown(body.content) : existing.content

		const post: Post = {
			...existing,
			...body,
			slug,
			content: prettyContent,
			updatedAt: new Date().toISOString(),
			author: body.author || existing.author
		}

		await savePost(env, post)
		return Response.json(post)
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
	}
}

async function handleDeletePost(request: Request, env: Env, slug: string): Promise<Response> {
	const user = await verifyAccess(request, env)

	if (!user) {
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		await deletePost(env, slug)
		await writeAnalyticsEvent(
			env,
			createAnalyticsEvent(AnalyticsEvents.DELETE, {
				slug,
				author: user.email
			})
		)
		return new Response('Deleted', { status: 200 })
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
	}
}

async function handleUploadMedia(request: Request, env: Env): Promise<Response> {
	const user = await verifyAccess(request, env)

	if (!user) {
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		const formData = await request.formData()
		const file = formData.get('file') as File

		if (!file) {
			return new Response('No file uploaded', { status: 400 })
		}

		const result = await uploadMedia(env, generateSlug(file.name), file)

		await writeAnalyticsEvent(
			env,
			createAnalyticsEvent(AnalyticsEvents.MEDIA_UPLOAD, {
				key: result.key,
				size: result.size,
				contentType: result.contentType,
				author: user.email
			})
		)

		return Response.json(result)
	} catch (error) {
		return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
	}
}

function generateSlug(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim()
}
