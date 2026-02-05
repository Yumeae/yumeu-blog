import { motion } from 'motion/react'
import { useState } from 'react'

export default function LikePosition() {
	const [liked, setLiked] = useState(false)
	const [likeCount, setLikeCount] = useState(99)

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.6, delay: 0.3 }}
			className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'
			style={{ cursor: 'pointer' }}>
			<motion.div
				onClick={() => {
					setLiked(!liked)
					setLikeCount(liked ? likeCount - 1 : likeCount + 1)
				}}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				className='card flex flex-col items-center justify-center p-4 text-center'
				style={{ width: 140, height: 100 }}>
				<motion.div
					className='mb-2 text-4xl'
					animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
					transition={{ duration: 0.3 }}>
					{liked ? '❤️' : '🤍'}
				</motion.div>
				<div className='text-sm font-medium text-gray-700'>{likeCount}</div>
				<div className='text-xs text-gray-500'>点赞</div>
			</motion.div>
		</motion.div>
	)
}
