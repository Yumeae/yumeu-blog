import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

export default function HiCard() {
	function getGreeting() {
		const hour = new Date().getHours()

		if (hour >= 6 && hour < 12) {
			return 'Good Morning'
		} else if (hour >= 12 && hour < 18) {
			return 'Good Afternoon'
		} else if (hour >= 18 && hour < 22) {
			return 'Good Evening'
		} else {
			return 'Good Night'
		}
	}

	const greeting = getGreeting()
	const username = 'YUMEU'

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className='card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform p-6 text-center'
			style={{ width: 280, height: 280 }}>
			<img src='/images/avatar.png' alt='Avatar' className='mx-auto rounded-full' style={{ width: 120, height: 120, boxShadow: '0 16px 32px -5px #E2D9CE' }} />
			<h1 className='mt-4 text-2xl' style={{ fontFamily: 'var(--font-averia)' }}>
				{greeting} <br /> I'm{' '}
				<span className='text-linear' style={{ fontSize: '32px' }}>
					{username}
				</span>{' '}
				, Nice to <br /> meet you!
			</h1>
		</motion.div>
	)
}
