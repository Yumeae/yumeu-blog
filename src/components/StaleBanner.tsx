import { useState, useEffect } from 'react'
import type { PostIndex } from '@/types'

export default function StaleBanner() {
	const [stale, setStale] = useState(false)

	useEffect(() => {
		const checkStale = async () => {
			try {
				const res = await fetch('/api/posts')
				const data: PostIndex = await res.json()

				if (data.stale) {
					setStale(true)
					await fetch('/api/posts/refresh', { method: 'POST' })
				}
			} catch (error) {
				console.error('Failed to check stale status:', error)
			}
		}

		const interval = setInterval(checkStale, 60000)
		checkStale()

		return () => clearInterval(interval)
	}, [])

	if (!stale) return null

	return (
		<div className='mb-4 border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700' role='alert'>
			<p className='font-bold'>内容过期</p>
			<p>正在刷新内容，请稍候...</p>
		</div>
	)
}
