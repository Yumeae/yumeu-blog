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
			initial={{ opacity: 0, y: -30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0.15 }}
			className='card absolute left-1/2 top-1/2 p-6'
			style={{
				width: 180,
				height: 180,
				marginLeft: 120,
				marginTop: -200,
				cursor: 'grab'
			}}>
			<div className='mb-4 flex items-center justify-center'>
				<motion.div
					className='text-4xl'
					animate={{ rotate: [0, 360] }}
					transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
					⏰
				</motion.div>
			</div>
			<div className='space-y-1 text-center'>
				<div className='text-4xl font-bold' style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>
					{hours}:{minutes}
				</div>
				<div className='text-lg text-gray-500' style={{ fontFamily: 'monospace' }}>
					{seconds}
				</div>
			</div>
		</motion.div>
	)
}
