import { useCenterStore } from './use-center'
import { motion } from 'motion/react'
import { useConfigStore } from './config-store'
import HomeDraggableLayer from './home-draggable-layer'

export default function HiCard() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()

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
	const styles = cardStyles.hiCard
	const username = siteContent.meta.username || 'Suni'

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x - styles.width / 2
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - styles.height / 2

	return (
		<HomeDraggableLayer cardKey='hiCard' x={x} y={y} width={styles.width} height={styles.height}>
			<div order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='card relative text-center'>
				<img
					src='/images/avatar.png'
					alt='Avatar'
					className='mx-auto rounded-full'
					style={{ width: 120, height: 120, boxShadow: '0 16px 32px -5px #E2D9CE' }}
				/>
				<h1 className='mt-3 text-2xl' style={{ fontFamily: 'var(--font-averia)' }}>
					{greeting} <br /> I'm{' '}
					<span className='text-linear' style={{ fontSize: '32px' }}>
						{username}
					</span>{' '}
					, Nice to <br /> meet you!
				</h1>
			</div>
		</HomeDraggableLayer>
	)
}
