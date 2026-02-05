import { motion } from 'motion/react'

export default function CalendarCard() {
	const date = new Date()
	const day = date.getDate()
	const month = date.getMonth() + 1
	const year = date.getFullYear()

	const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
	const weekDays = ['日', '一', '二', '三', '四', '五', '六']
	const todayWeekDay = weekDays[date.getDay()]

	return (
		<motion.div
			initial={{ opacity: 0, x: 30 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6, delay: 0.2 }}
			className='card absolute left-1/2 top-1/2 p-5'
			style={{
				width: 180,
				height: 200,
				marginLeft: 240,
				marginTop: -100,
				cursor: 'grab'
			}}>
			<div className='mb-3 flex items-center justify-center'>
				<motion.div
					className='text-4xl'
					whileHover={{ rotate: [0, -20, 20, 0] }}
					transition={{ duration: 0.5 }}>
					📅
				</motion.div>
			</div>
			<div className='text-center'>
				<div className='mb-2 text-5xl font-bold text-linear'>{day}</div>
				<div className='mb-1 text-sm font-medium text-gray-700'>{monthNames[month - 1]}</div>
				<div className='text-xs text-gray-500'>
					{year} · 星期{todayWeekDay}
				</div>
			</div>
		</motion.div>
	)
}
