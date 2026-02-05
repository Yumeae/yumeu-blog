import { motion } from 'motion/react'

export default function Hero() {
	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'>
			<div className='absolute inset-0 opacity-30'>
				<div className='absolute left-20 top-20 h-72 w-72 animate-pulse rounded-full bg-purple-500 blur-3xl filter' />
				<div className='absolute bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-blue-500 blur-3xl filter delay-1000' />
			</div>

			<div className='container relative z-10 mx-auto px-4 py-16 text-center'>
				<motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-6 text-5xl font-bold md:text-7xl'>
					欢迎来到我的博客
				</motion.h1>

				<motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='mb-8 text-xl text-gray-300 md:text-2xl'>
					探索技术、分享心得、记录成长
				</motion.p>

				<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className='flex justify-center gap-4'>
					<motion.a
						href='/posts'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='rounded-xl bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-100'>
						浏览文章
					</motion.a>
					<motion.a
						href='/about'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className='rounded-xl border border-white/30 px-6 py-3 font-medium transition-colors hover:bg-white/10'>
						了解更多
					</motion.a>
				</motion.div>
			</div>
		</motion.section>
	)
}
