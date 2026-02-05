import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useCenterStore } from './use-center'
import HiCard from './HiCard'
import ArticleCard from './ArticleCard'
import ClockCard from './ClockCard'
import CalendarCard from './CalendarCard'
import ShareCard from './ShareCard'
import LikePosition from './LikePosition'
import HatCard from './HatCard'
import BeianCard from './BeianCard'

export default function Home() {
	const [editing, setEditing] = useState(false)

	const cardStyles = {
		hiCard: { enabled: true, order: 0, width: 280, height: 280, offsetX: 0, offsetY: 0 },
		articleCard: { enabled: true, order: 1, width: 240, height: 180, offsetX: 0, offsetY: 0 },
		shareCard: { enabled: true, order: 2, width: 200, height: 160, offsetX: 0, offsetY: 0 },
		likePosition: { enabled: true, order: 3, width: 120, height: 80, offsetX: 0, offsetY: 0 },
		clockCard: { enabled: true, order: 4, width: 160, height: 160, offsetX: 0, offsetY: 0 },
		calendarCard: { enabled: true, order: 5, width: 160, height: 160, offsetX: 0, offsetY: 0 },
		hatCard: { enabled: true, order: 6, width: 160, height: 160, offsetX: 0, offsetY: 0 },
		beianCard: { enabled: true, order: 7, width: 200, height: 100, offsetX: 0, offsetY: 0 }
	}

	const center = useCenterStore()

	const handleSave = () => {
		setEditing(false)
		console.log('保存布局位置')
	}

	const handleCancel = () => {
		setEditing(false)
		console.log('取消修改')
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === ',')) {
				e.preventDefault()
				setEditing(true)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const getGreeting = () => {
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

	return (
		<div className='relative min-h-screen'>
			<HiCard />

			{cardStyles.articleCard?.enabled !== false && <ArticleCard />}
			{cardStyles.shareCard?.enabled !== false && <ShareCard />}
			{cardStyles.likePosition?.enabled !== false && <LikePosition />}
			{cardStyles.clockCard?.enabled !== false && <ClockCard />}
			{cardStyles.calendarCard?.enabled !== false && <CalendarCard />}
			{cardStyles.hatCard?.enabled !== false && <HatCard />}
			{cardStyles.beianCard?.enabled !== false && <BeianCard />}

			{editing && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='fixed inset-0 top-0 z-50 flex justify-center pt-6'>
					<div className='rounded-2xl bg-white/80 px-6 py-4 shadow-lg backdrop-blur-lg'>
						<p className='text-sm text-gray-600'>正在编辑首页布局，拖拽卡片调整位置</p>
						<button
							onClick={handleCancel}
							className='rounded-xl border bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100'>
							取消
						</button>
						<button onClick={handleSave} className='rounded-xl border bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-xs font-medium text-white'>
							保存偏移
						</button>
					</div>
				</motion.div>
			)}
		</div>
	)
}
