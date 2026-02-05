import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

export default function ArticleCard() {
	const [posts, setPosts] = useState([
		{ title: '学习 Astro 框架', date: '2024-01-15', emoji: '🚀' },
		{ title: 'React 性能优化', date: '2024-01-10', emoji: '⚡' },
		{ title: 'TypeScript 进阶', date: '2024-01-05', emoji: '📘' }
	])

	return (
		<motion.div
			initial={{ opacity: 0, x: -30 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6, delay: 0.1 }}
			className='card absolute left-1/2 top-1/2 p-5'
			style={{
				width: 280,
				height: 220,
				marginLeft: -200,
				marginTop: -100,
				cursor: 'grab'
			}}>
			<div className='mb-4 flex items-center gap-3'>
				<motion.div className='text-4xl' animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
					📝
				</motion.div>
				<div>
					<h3 className='text-xl font-bold'>文章</h3>
					<p className='text-xs text-gray-500'>Latest Posts</p>
				</div>
			</div>
			<div className='space-y-2'>
				{posts.map((post, index) => (
					<motion.a
						key={index}
						href={`/posts/${index}`}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 + index * 0.1 }}
						className='group flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
						whileHover={{ x: 8 }}
						whileTap={{ scale: 0.98 }}>
						<span className='text-lg'>{post.emoji}</span>
						<div className='flex-1'>
							<div className='text-sm font-medium text-gray-800 group-hover:text-purple-700'>{post.title}</div>
							<div className='text-xs text-gray-500'>{post.date}</div>
						</div>
						<motion.span className='text-gray-400' whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300 }}>
							→
						</motion.span>
					</motion.a>
				))}
			</div>
		</motion.div>
	)
}
