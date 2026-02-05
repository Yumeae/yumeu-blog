import { motion } from 'motion/react'
import type { Post } from '@/types'

interface Props {
	post: Post
	index: number
}

export default function PostCard({ post, index }: Props) {
	return (
		<motion.article
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
			whileHover={{ y: -5, scale: 1.02 }}
			className='group overflow-hidden rounded-2xl border border-gray-200/50 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>
			{post.heroImageUrl && (
				<div className='relative h-48 overflow-hidden'>
					<img src={post.heroImageUrl} alt={post.title} className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110' />
					<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
				</div>
			)}

			<div className='p-6'>
				<div className='mb-3 flex items-center gap-2 text-sm text-gray-500'>
					<time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</time>
					{post.author && (
						<>
							<span>•</span>
							<span>{post.author}</span>
						</>
					)}
				</div>

				<h2 className='mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
					<a href={`/posts/${post.slug}`}>{post.title}</a>
				</h2>

				<p className='mb-4 line-clamp-2 text-gray-600'>{post.description}</p>

				<div className='flex items-center justify-between'>
					<span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700'>{post.status === 'published' ? '已发布' : '草稿'}</span>

					<motion.a href={`/posts/${post.slug}`} whileHover={{ scale: 1.05 }} className='font-medium text-blue-600 transition-colors hover:text-blue-700'>
						阅读更多 →
					</motion.a>
				</div>
			</div>
		</motion.article>
	)
}
