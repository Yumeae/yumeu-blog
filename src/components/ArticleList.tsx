import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import type { Post } from '@/types'

export default function ArticleList() {
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
		return <div className='py-12 text-center'>加载中...</div>
	}

	if (posts.length === 0) {
		return (
			<section className='container mx-auto px-4 py-16'>
				<div className='text-center'>
					<h2 className='mb-4 text-2xl font-bold'>暂无文章</h2>
					<p className='text-slate-600'>敬请期待更多精彩内容</p>
				</div>
			</section>
		)
	}

	return (
		<section className='container mx-auto px-4 py-16'>
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
				{posts.map(post => (
					<motion.article
						key={post.slug}
						whileHover={{ y: -5 }}
						className='overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-slate-800'>
						{post.heroImageUrl && <img src={post.heroImageUrl} alt={post.title} className='h-48 w-full object-cover' />}
						<div className='p-6'>
							<h2 className='mb-2 text-xl font-bold'>
								<a href={`/posts/${post.slug}`} className='transition-colors hover:text-blue-600'>
									{post.title}
								</a>
							</h2>
							<p className='mb-4 line-clamp-2 text-slate-600 dark:text-slate-400'>{post.description}</p>
							<div className='flex items-center justify-between text-sm text-slate-500'>
								<time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</time>
								{post.author && <span>作者: {post.author}</span>}
							</div>
						</div>
					</motion.article>
				))}
			</motion.div>
		</section>
	)
}
