import { motion } from 'motion/react'

export default function StatsSection() {
	const stats = [
		{ number: '10+', label: '篇文章' },
		{ number: '5', label: '个项目' },
		{ number: '1K+', label: '访客' },
		{ number: '99%', label: '好评' }
	]

	return (
		<section className='bg-gradient-to-r from-purple-600 to-blue-600 py-20 text-white'>
			<div className='mx-auto max-w-6xl px-4'>
				<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className='mb-12 text-center'>
					<h2 className='mb-4 text-4xl font-bold md:text-5xl'>数据统计</h2>
					<p className='text-xl opacity-90'>博客的各项指标和成就</p>
				</motion.div>

				<div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
					{stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className='p-8 text-center'>
							<motion.div
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 100 }}
								className='mb-3 text-5xl font-bold md:text-6xl'>
								{stat.number}
							</motion.div>
							<p className='text-lg opacity-90'>{stat.label}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
