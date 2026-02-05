import { motion } from 'motion/react'
import { useState } from 'react'

export default function HatCard() {
	const [hasHat, setHasHat] = useState(false)
	const [hatStyle, setHatStyle] = useState(0)

	const hatStyles = ['🎩', '👑', '🧢', '⛑️', '🎓']

	const handleHatClick = () => {
		if (hasHat) {
			setHasHat(false)
		} else {
			setHatStyle((prev) => (prev + 1) % hatStyles.length)
			setHasHat(true)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: 40 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6, delay: 0.35 }}
			className='card absolute left-1/2 top-1/2 p-4'
			style={{
				width: 180,
				height: 180,
				marginLeft: 320,
				marginTop: -140,
				cursor: 'grab'
			}}>
			<motion.div
				onClick={handleHatClick}
				className='flex h-full flex-col items-center justify-center'
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}>
				<motion.div
					className='mb-3 text-5xl'
					animate={hasHat ? { y: [0, -10, 0] } : {}}
					transition={{ duration: 0.5, repeat: hasHat ? 1 : 0 }}>
					{hasHat ? hatStyles[hatStyle] : '🧢'}
				</motion.div>
				<p className='text-center text-sm text-gray-600'>点击戴帽子</p>
				{hasHat && (
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className='mt-2 text-xs text-purple-600'>
						太酷了！
					</motion.p>
				)}
			</motion.div>
		</motion.div>
	)
}
