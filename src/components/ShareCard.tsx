import { motion } from 'motion/react'

export default function ShareCard() {
	const socialLinks = [
		{ icon: '💻', label: 'GitHub', url: '#' },
		{ icon: '✉️', label: '邮件', url: '#' },
		{ icon: '📱', label: '二维码', url: '#' },
		{ icon: '🐦', label: 'Twitter', url: '#' }
	]

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.25 }}
			className='card absolute left-1/2 top-1/2 p-5'
			style={{
				width: 220,
				height: 220,
				marginLeft: 100,
				marginTop: 140,
				cursor: 'grab'
			}}>
			<div className='mb-4 flex items-center gap-3'>
				<motion.div className='text-3xl' animate={{ bounce: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}>
					🔗
				</motion.div>
				<div>
					<h3 className='text-xl font-bold'>分享</h3>
					<p className='text-xs text-gray-500'>Connect Me</p>
				</div>
			</div>
			<div className='grid grid-cols-2 gap-3'>
				{socialLinks.map((social, index) => (
					<motion.a
						key={index}
						href={social.url}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.3 + index * 0.05 }}
						className='flex flex-col items-center gap-1 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 p-3 transition-all hover:from-purple-100 hover:to-blue-100'
						whileHover={{ y: -4 }}
						whileTap={{ scale: 0.95 }}>
						<span className='text-2xl'>{social.icon}</span>
						<span className='text-xs font-medium text-gray-700'>{social.label}</span>
					</motion.a>
				))}
			</div>
		</motion.div>
	)
}
