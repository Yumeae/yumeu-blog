import { motion } from 'motion/react'

export default function WelcomeSection() {
	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			className='relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50'>
			<div className='absolute inset-0 opacity-30'>
				<div className='absolute left-20 top-20 h-72 w-72 animate-pulse rounded-full bg-purple-400 blur-3xl filter' />
				<div className='absolute bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-blue-400 blur-3xl filter delay-1000' />
				<div className='absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-pink-400 blur-3xl filter delay-500' />
			</div>

			<div className='container relative z-10 mx-auto px-4 text-center'>
				<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 100 }} className='mb-8'>
					<h1 className='mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-6xl font-bold text-transparent md:text-8xl'>YUMEU</h1>
					<p className='mx-auto max-w-2xl text-xl text-gray-600 md:text-2xl'>欢迎来到我的博客，探索技术与创意的世界</p>
				</motion.div>
			</div>
		</motion.section>
	)
}
