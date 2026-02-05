import { motion } from 'motion/react'

export default function BeianCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'
			style={{
				cursor: 'grab'
			}}>
			<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='card p-4 text-center' style={{ width: 200, height: 100 }}>
				<div className='mb-2 text-3xl'>🔒</div>
				<div className='mb-2 text-sm font-bold'>ICP备案</div>
				<div className='text-xs text-gray-500'>京ICP备12345678号</div>
			</motion.div>
		</motion.div>
	)
}
