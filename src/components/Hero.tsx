import { motion } from 'motion/react'

export default function Hero() {
	return (
		<section className='relative flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white'>
			<div className='container mx-auto px-4 py-16 text-center'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
					<h1 className='mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-5xl font-bold text-transparent md:text-7xl'>
						Astro + Cloudflare 博客
					</h1>
					<p className='mx-auto mb-8 max-w-2xl text-xl text-slate-300 md:text-2xl'>构建于 Cloudflare Pages + Workers + KV + R2 的现代化博客系统</p>
				</motion.div>
			</div>
		</section>
	)
}
