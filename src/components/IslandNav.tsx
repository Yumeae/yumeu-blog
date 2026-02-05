import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import type { NavItem } from '@/types/site'

export default function IslandNav() {
	const [isOpen, setIsOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)

	const navItems: NavItem[] = [
		{ label: '首页', href: '/' },
		{ label: '文章', href: '/posts' },
		{ label: '关于', href: '/about' },
		{ label: 'GitHub', href: 'https://github.com' }
	]

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<motion.nav
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className={`fixed left-4 right-4 top-4 z-50 transition-all duration-300 ${scrolled ? 'top-2' : 'top-4'}`}>
			<div className='mx-auto max-w-6xl'>
				<div className='rounded-2xl border border-white/20 bg-white/90 px-6 py-4 shadow-lg backdrop-blur-lg'>
					<div className='flex items-center justify-between'>
						<motion.a
							href='/'
							className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent'
							whileHover={{ scale: 1.05 }}>
							YUMEU
						</motion.a>

						<div className='hidden items-center gap-1 md:flex'>
							{navItems.map((item, index) => (
								<motion.a
									key={item.href}
									href={item.href}
									target={item.href.startsWith('http') ? '_blank' : undefined}
									rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.05 }}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className='rounded-xl px-4 py-2 text-gray-700 transition-all hover:bg-gray-100/50 hover:text-gray-900'>
									{item.label}
								</motion.a>
							))}
						</div>

						<motion.button
							className='rounded-xl p-2 transition-colors hover:bg-gray-100/50 md:hidden'
							onClick={() => setIsOpen(!isOpen)}
							whileTap={{ scale: 0.95 }}>
							<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
							</svg>
						</motion.button>
					</div>
				</div>

				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							className='mt-2 rounded-2xl border border-white/20 bg-white/95 px-6 py-4 shadow-lg backdrop-blur-lg md:hidden'>
							<div className='flex flex-col gap-2'>
								{navItems.map(item => (
									<a
										key={item.href}
										href={item.href}
										target={item.href.startsWith('http') ? '_blank' : undefined}
										rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
										className='rounded-xl px-4 py-3 text-gray-700 transition-all hover:bg-gray-100/50 hover:text-gray-900'
										onClick={() => setIsOpen(false)}>
										{item.label}
									</a>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.nav>
	)
}
