import HomeCard from './HomeCard'
import { motion } from 'motion/react'

export default function CardsSection() {
	const cards = [
		{
			title: '最新文章',
			description: '阅读我的最新技术文章和学习笔记',
			icon: '📝',
			href: '/posts',
			delay: 0
		},
		{
			title: '关于我',
			description: '了解更多关于我的信息和技术栈',
			icon: '👋',
			href: '/about',
			delay: 0.1
		},
		{
			title: 'GitHub',
			description: '查看我的开源项目和代码',
			icon: '💻',
			href: 'https://github.com',
			delay: 0.2
		},
		{
			title: '联系方式',
			description: '通过邮件或社交媒体联系我',
			icon: '✉️',
			href: 'mailto:hello@yumeu.com',
			delay: 0.3
		}
	]

	return (
		<section className='px-4 py-20'>
			<div className='mx-auto max-w-7xl'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-100px' }}
					className='mb-12 text-center'>
					<h2 className='mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl'>探索内容</h2>
					<p className='text-xl text-gray-600'>选择一个卡片开始你的旅程</p>
				</motion.div>

				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
					{cards.map(card => (
						<HomeCard key={card.href} {...card} />
					))}
				</div>
			</div>
		</section>
	)
}
