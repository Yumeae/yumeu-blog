import { motion } from 'motion/react'

export default function BeianCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.4 }}
			className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'
			style={{ cursor: 'grab' }}>
			<motion.a
				href='https://beian.miit.gov.cn/'
				target='_blank'
				rel='noopener noreferrer'
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className='card flex flex-col items-center justify-center p-4 text-center'
				style={{ width: 220, height: 110 }}>
				<div className='mb-2 text-3xl'>🔒</div>
				<div className='mb-2 text-sm font-bold text-gray-800'>ICP备案</div>
				<div className='text-xs text-gray-500'>京ICP备12345678号</div>
			</motion.a>
		</motion.div>
	)
}
