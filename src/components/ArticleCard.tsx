import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

export default function ArticleCard() {
	const [posts, setPosts] = useState([
		{ title: '学习 Astro 框架', date: '2024-01-15' },
		{ title: 'React 性能优化', date: '2024-01-10' },
		{ title: 'TypeScript 进阶', date: '2024-01-05' }
	])

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6 }}
			className='card absolute left-1/2 top-1/2 p-6'
			style={{
				width: 240,
				height: 180,
				marginLeft: -140,
				marginTop: -90,
				cursor: 'grab'
			}}>
			<div className='mb-4 flex items-center gap-3'>
				<div className='text-3xl'>📝</div>
				<h3 className='text-xl font-bold'>文章</h3>
			</div>
			<div className='space-y-2'>
				{posts.map((post, index) => (
					<motion.a
						key={index}
						href={`/posts/${index}`}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
						className='block rounded-lg px-3 py-2 transition-colors hover:bg-gray-100'
						whileHover={{ x: 5 }}>
						<div className='text-sm font-medium'>{post.title}</div>
						<div className='text-xs text-gray-500'>{post.date}</div>
					</motion.a>
				))}
			</div>
		</motion.div>
	)
}
