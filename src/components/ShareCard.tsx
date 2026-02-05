import { motion } from 'motion/react'

export default function ShareCard() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6 }}
			className='card absolute left-1/2 top-1/2 p-6'
			style={{
				width: 200,
				height: 160,
				marginLeft: 100,
				marginTop: 120,
				cursor: 'grab'
			}}>
			<div className='mb-4 text-3xl'>🔗</div>
			<h3 className='mb-3 text-xl font-bold'>分享</h3>
			<div className='space-y-2'>
				<div className='flex cursor-pointer items-center gap-2 text-gray-700 hover:text-gray-900'>
					<span>💻</span>
					<span>GitHub</span>
				</div>
				<div className='flex cursor-pointer items-center gap-2 text-gray-700 hover:text-gray-900'>
					<span>✉️</span>
					<span>邮件</span>
				</div>
				<div className='flex cursor-pointer items-center gap-2 text-gray-700 hover:text-gray-900'>
					<span>📱</span>
					<span>二维码</span>
				</div>
			</div>
		</motion.div>
	)
}
