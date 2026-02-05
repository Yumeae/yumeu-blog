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
		hiCard: { enabled: true, order: 0, width: 320, height: 320, offsetX: 0, offsetY: 0 },
		articleCard: { enabled: true, order: 1, width: 280, height: 220, offsetX: 0, offsetY: 0 },
		shareCard: { enabled: true, order: 2, width: 220, height: 220, offsetX: 0, offsetY: 0 },
		likePosition: { enabled: true, order: 3, width: 140, height: 100, offsetX: 0, offsetY: 0 },
		clockCard: { enabled: true, order: 4, width: 180, height: 180, offsetX: 0, offsetY: 0 },
		calendarCard: { enabled: true, order: 5, width: 180, height: 200, offsetX: 0, offsetY: 0 },
		hatCard: { enabled: true, order: 6, width: 180, height: 180, offsetX: 0, offsetY: 0 },
		beianCard: { enabled: true, order: 7, width: 220, height: 110, offsetX: 0, offsetY: 0 }
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

	return (
		<div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50'>
			<div className='absolute inset-0 opacity-30'>
				<div className='absolute top-20 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 blur-3xl' />
				<div className='absolute bottom-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-pink-200 to-orange-200 blur-3xl' />
			</div>

			<div className='relative z-10' style={{ height: 'calc(100vh - 200px)' }}>
				<HiCard />

				{cardStyles.articleCard?.enabled !== false && <ArticleCard />}
				{cardStyles.shareCard?.enabled !== false && <ShareCard />}
				{cardStyles.likePosition?.enabled !== false && <LikePosition />}
				{cardStyles.clockCard?.enabled !== false && <ClockCard />}
				{cardStyles.calendarCard?.enabled !== false && <CalendarCard />}
				{cardStyles.hatCard?.enabled !== false && <HatCard />}
				{cardStyles.beianCard?.enabled !== false && <BeianCard />}
			</div>

			{editing && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='fixed inset-0 z-50 flex justify-center pt-8'>
					<div className='rounded-2xl bg-white/90 px-8 py-5 shadow-2xl backdrop-blur-xl border border-purple-100'>
						<div className='mb-4 flex items-center gap-3'>
							<div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white'>
								✨
							</div>
							<div>
								<p className='font-bold text-gray-800'>编辑模式</p>
								<p className='text-sm text-gray-600'>拖拽卡片调整位置</p>
							</div>
						</div>
						<div className='flex gap-3'>
							<button
								onClick={handleCancel}
								className='rounded-xl border-2 border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50'>
								取消
							</button>
							<button
								onClick={handleSave}
								className='rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40'>
								保存布局
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	)
}
