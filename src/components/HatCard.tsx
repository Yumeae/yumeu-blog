import { motion } from 'motion/react'

export default function HatCard() {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6 }}
			className='card absolute left-1/2 top-1/2 p-4'
			style={{
				width: 160,
				height: 160,
				marginLeft: 340,
				marginTop: -90,
				cursor: 'grab'
			}}>
			<div className='text-3xl'>🎩</div>
			<div className='text-center text-sm text-gray-600'>点击戴帽子</div>
		</motion.div>
	)
}
