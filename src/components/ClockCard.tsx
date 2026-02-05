import { motion } from 'motion/react'
import { useState, useEffect } from 'react'

export default function ClockCard() {
	const [time, setTime] = useState(new Date())

	useEffect(() => {
		const timer = setInterval(() => setTime(new Date()), 1000)
		return () => clearInterval(timer)
	}, [])

	const hours = String(time.getHours()).padStart(2, '0')
	const minutes = String(time.getMinutes()).padStart(2, '0')
	const seconds = String(time.getSeconds()).padStart(2, '0')

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className='card absolute left-1/2 top-1/2 p-6'
			style={{
				width: 160,
				height: 160,
				marginLeft: 80,
				marginTop: -180,
				cursor: 'grab'
			}}>
			<div className='mb-3 flex items-center justify-center'>
				<div className='text-3xl'>⏰</div>
			</div>
			<div className='text-center text-4xl font-bold' style={{ fontFamily: 'monospace' }}>
				{hours}:{minutes}:{seconds}
			</div>
		</motion.div>
	)
}
