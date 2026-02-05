import { motion } from 'motion/react'

interface Props {
	title: string
	description: string
	icon: string
	href: string
	delay: number
}

export default function Card({ title, description, icon, href, delay }: Props) {
	return (
		<motion.a
			href={href}
			initial={{ opacity: 0, y: 30, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ delay, type: 'spring', stiffness: 100 }}
			whileHover={{
				y: -10,
				scale: 1.05,
				transition: { type: 'spring', stiffness: 300 }
			}}
			whileTap={{ scale: 0.95 }}
			className='card group relative overflow-hidden bg-white/80 p-8 backdrop-blur-sm'>
			<div className='mb-4 text-5xl transition-transform duration-300 group-hover:scale-110'>{icon}</div>
			<h3 className='mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-purple-600'>{title}</h3>
			<p className='leading-relaxed text-gray-600'>{description}</p>
			<div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
		</motion.a>
	)
}
