import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import type { Post } from '@/types'
import PostCard from './PostCard'

export default function PostGrid() {
	const [posts, setPosts] = useState<Post[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchPosts()
	}, [])

	const fetchPosts = async () => {
		try {
			const res = await fetch('/api/posts')
			const data = await res.json()
			setPosts(data.items || [])
		} catch (error) {
			console.error('Failed to fetch posts:', error)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className='flex min-h-[400px] items-center justify-center'>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
					className='h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent'
				/>
			</div>
		)
	}

	if (posts.length === 0) {
		return (
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='py-20 text-center'>
				<div className='mb-4 text-6xl'>📝</div>
				<h3 className='mb-2 text-2xl font-bold text-gray-900'>暂无文章</h3>
				<p className='text-gray-600'>敬请期待更多精彩内容</p>
			</motion.div>
		)
	}

	return (
		<section className='py-16'>
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='container mx-auto px-4'>
				<h2 className='mb-8 text-3xl font-bold text-gray-900'>最新文章</h2>

				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{posts.map((post: Post, index: number) => (
						<PostCard key={post.slug} post={post} index={index} />
					))}
				</div>
			</motion.div>
		</section>
	)
}
