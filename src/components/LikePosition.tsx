import { motion } from 'motion/react'

export default function LikePosition() {
	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6 }}
			className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'
			style={{
				cursor: 'grab'
			}}>
			<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className='card p-4 text-center' style={{ width: 120, height: 80 }}>
				<div className='mb-2 text-3xl'>❤️</div>
				<div className='text-sm text-gray-600'>点赞</div>
			</motion.div>
		</motion.div>
	)
}
