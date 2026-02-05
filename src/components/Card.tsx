import type { ReactNode } from 'react'

interface Props {
	children: ReactNode
	className?: string
	delay?: number
}

export default function Card({ children, className = '', delay = 0 }: Props) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay }}
			className={`card bg-white/80 backdrop-blur-sm ${className}`}>
			{children}
		</motion.div>
	)
}
