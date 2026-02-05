import { siteConfig } from '@/config/site'
import type { NavItem } from '@/types/site'
import { motion } from 'motion/react'

export default function Navbar() {
	return (
		<motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className='fixed left-0 right-0 top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md'>
			<div className='container mx-auto px-4 py-4'>
				<div className='flex items-center justify-between'>
					<motion.a
						href='/'
						className='bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent'
						whileHover={{ scale: 1.05 }}>
						{siteConfig.name}
					</motion.a>

					<div className='flex items-center gap-6'>
						{siteConfig.navItems.map((item: NavItem, index) => (
							<motion.a
								key={item.href}
								href={item.href}
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.05 }}
								className='font-medium text-gray-700 transition-colors hover:text-gray-900'>
								{item.label}
							</motion.a>
						))}
					</div>
				</div>
			</div>
		</motion.nav>
	)
}
