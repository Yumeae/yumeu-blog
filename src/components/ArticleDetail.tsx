import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import type { Post } from '@/types'

interface ArticleDetailProps {
	slug: string
}

export default function ArticleDetail({ slug }: ArticleDetailProps) {
	const [post, setPost] = useState<Post | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchPost()
	}, [slug])

	const fetchPost = async () => {
		try {
			setLoading(true)
			const res = await fetch(`/api/posts/${slug}`)

			if (!res.ok) {
				const data = await res.json()
				setError(data.code === 'missing-slug' ? '内容即将上线' : '加载失败')
				return
			}

			const data: Post = await res.json()
			setPost(data)
		} catch (error) {
			setError('加载失败')
			console.error('Failed to fetch post:', error)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return <div className='container mx-auto px-4 py-12 text-center'>加载中...</div>
	}

	if (error) {
		return (
			<div className='container mx-auto px-4 py-12'>
				<div className='rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center dark:border-yellow-800 dark:bg-yellow-900/20'>
					<h2 className='mb-4 text-2xl font-bold'>{error}</h2>
					<p className='mb-6 text-slate-600 dark:text-slate-400'>该内容即将上线，敬请期待</p>
					<a href='/' className='inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'>
						返回首页
					</a>
				</div>
			</div>
		)
	}

	if (!post) return null

	return (
		<motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='container mx-auto max-w-4xl px-4 py-12'>
			{post.heroImageUrl && <img src={post.heroImageUrl} alt={post.title} className='mb-8 h-64 w-full rounded-lg object-cover md:h-96' />}

			<h1 className='mb-4 text-4xl font-bold md:text-5xl'>{post.title}</h1>

			<div className='mb-8 flex items-center gap-4 text-slate-600 dark:text-slate-400'>
				{post.author && <span>作者: {post.author}</span>}
				<time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</time>
			</div>

			{post.description && <p className='mb-8 text-xl text-slate-700 dark:text-slate-300'>{post.description}</p>}

			<div className='prose dark:prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: post.content }} />
		</motion.article>
	)
}
