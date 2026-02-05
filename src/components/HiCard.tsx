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
			initial={{ opacity: 0, y: 20, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			className='card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform p-6 text-center'
			style={{ width: 320, height: 320, zIndex: 10 }}>
			<motion.div
				whileHover={{ scale: 1.05, rotate: 5 }}
				transition={{ type: 'spring', stiffness: 300 }}
				className='relative mx-auto mb-4'
				style={{ width: 120, height: 120 }}>
				<img src='/images/avatar.svg' alt='Avatar' className='rounded-full' style={{ width: '100%', height: '100%', boxShadow: '0 16px 32px -5px #35bfab40, 0 8px 16px -3px #1fc9e760' }} />
				<motion.div
					className='absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg'
					animate={{ scale: [1, 1.1, 1] }}
					transition={{ duration: 2, repeat: Infinity }}>
					<span>✨</span>
				</motion.div>
			</motion.div>
			<h1 className='text-2xl' style={{ fontFamily: 'var(--font-averia)' }}>
				{greeting} <br /> I'm{' '}
				<motion.span
					className='text-linear inline-block'
					style={{ fontSize: '36px' }}
					whileHover={{ scale: 1.1 }}>
					{username}
				</motion.span>
			</h1>
			<motion.p
				className='mt-2 text-sm text-gray-600'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}>
				Welcome to my blog 🎉
			</motion.p>
		</motion.div>
	)
}
