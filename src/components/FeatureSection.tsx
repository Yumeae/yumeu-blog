import { motion } from 'motion/react'

export default function FeatureSection() {
	const features = [
		{
			icon: '⚡',
			title: '高性能',
			description: '基于 Astro + Cloudflare 构建的超快加载速度'
		},
		{
			icon: '🎨',
			title: '精美设计',
			description: '现代化的卡片式布局，提供出色的视觉体验'
		},
		{
			icon: '📱',
			title: '响应式',
			description: '完美适配各种设备，随时随地访问'
		},
		{
			icon: '🔒',
			title: '安全可靠',
			description: 'Cloudflare Access 保护，数据安全无忧'
		}
	]

	return (
		<section className='bg-gradient-to-b from-gray-50 to-white py-16'>
			<div className='container mx-auto px-4'>
				<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className='mb-12 text-center'>
					<h2 className='mb-4 text-3xl font-bold text-gray-900'>特性亮点</h2>
					<p className='text-gray-600'>了解博客的主要功能和特点</p>
				</motion.div>

				<div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className='card p-6 text-center transition-shadow duration-300 hover:shadow-xl'>
							<div className='mb-4 text-5xl'>{feature.icon}</div>
							<h3 className='mb-2 text-xl font-bold text-gray-900'>{feature.title}</h3>
							<p className='text-gray-600'>{feature.description}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
