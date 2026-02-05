import { motion } from 'motion/react'

export default function CalendarCard() {
	const date = new Date()
	const day = date.getDate()
	const month = date.getMonth() + 1
	const year = date.getFullYear()

	const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className='card absolute left-1/2 top-1/2 p-6'
			style={{
				width: 160,
				height: 160,
				marginLeft: 280,
				marginTop: 0,
				cursor: 'grab'
			}}>
			<div className='mb-3 text-3xl'>📅</div>
			<div className='mb-2 text-center text-4xl font-bold'>{day}</div>
			<div className='text-center text-sm text-gray-600'>
				{monthNames[month]} {year}
			</div>
		</motion.div>
	)
}
