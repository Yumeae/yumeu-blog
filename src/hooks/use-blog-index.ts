import useSWR from 'swr'
import { useAuthStore } from '@/hooks/use-auth'
import { useCallback, useMemo } from 'react'
import type { BlogIndexItem } from '@/app/blog/types'

export type { BlogIndexItem } from '@/app/blog/types'

type PostsApiResponse = {
	items: BlogIndexItem[]
	versionTimestamp: number
	generatedAt: number
	stale: boolean
}

const FALLBACK_STALE_OFFSET = 6 * 60 * 1000

const fetchPosts = async (): Promise<PostsApiResponse> => {
	const apiRes = await fetch('/api/posts', { cache: 'no-store' })
	if (apiRes.ok) {
		const data = await apiRes.json()
		return {
			items: Array.isArray(data.items) ? data.items : [],
			versionTimestamp: Number(data.versionTimestamp) || Date.now(),
			generatedAt: Number(data.generatedAt) || Date.now(),
			stale: Boolean(data.stale)
		}
	}
	const fallbackRes = await fetch('/blogs/index.json', { cache: 'no-store' })
	if (fallbackRes.ok) {
		const list = await fallbackRes.json()
		return {
			items: Array.isArray(list) ? list : [],
			versionTimestamp: Date.now() - FALLBACK_STALE_OFFSET,
			generatedAt: Date.now(),
			stale: true
		}
	}
	const error: any = new Error('Fetch posts failed')
	error.status = apiRes.status
	throw error
}

export function useBlogIndex() {
	const { isAuth } = useAuthStore()
	const { data, error, isLoading } = useSWR<PostsApiResponse>('/api/posts', fetchPosts, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true
	})

	const items = useMemo(() => {
		const list = data?.items || []
		if (isAuth) return list
		return list.filter(item => !item.hidden)
	}, [data?.items, isAuth])

	const requestRefresh = useCallback(async () => {
		try {
			await fetch('/api/posts/refresh', { method: 'POST' })
		} catch (error) {
			console.error('触发刷新失败', error)
		}
	}, [])

	return {
		items,
		loading: isLoading,
		error,
		stale: Boolean(data?.stale),
		versionTimestamp: data?.versionTimestamp ?? 0,
		requestRefresh
	}
}

export function useLatestBlog() {
	const { items, loading, error, stale, versionTimestamp, requestRefresh } = useBlogIndex()
	const latestBlog = useMemo(() => {
		if (items.length === 0) return null
		return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
	}, [items])

	return {
		blog: latestBlog,
		loading,
		error,
		stale,
		versionTimestamp,
		requestRefresh
	}
}
