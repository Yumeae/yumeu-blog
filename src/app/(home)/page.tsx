'use client'

import HiCard from '@/app/(home)/hi-card'
import ArtCard from '@/app/(home)/art-card'
import ClockCard from '@/app/(home)/clock-card'
import CalendarCard from '@/app/(home)/calendar-card'
import SocialButtons from '@/app/(home)/social-buttons'
import ShareCard from '@/app/(home)/share-card'
import AritcleCard from '@/app/(home)/aritcle-card'
import WriteButtons from '@/app/(home)/write-buttons'
import LikePosition from './like-position'
import HatCard from './hat-card'
import BeianCard from './beian-card'
import { useSize } from '@/hooks/use-size'
import { motion } from 'motion/react'
import { useLayoutEditStore } from './stores/layout-edit-store'
import { useConfigStore } from './stores/config-store'
import { toast } from 'sonner'
import ConfigDialog from './config-dialog/index'
import { useEffect, useState } from 'react'
import SnowfallBackground from '@/layout/backgrounds/snowfall'
import Link from 'next/link'
import { Search, BookOpen, FolderTree, Code2, Calendar } from 'lucide-react'

export default function Home() {
	const { maxSM } = useSize()
	const { cardStyles, configDialogOpen, setConfigDialogOpen, siteContent } = useConfigStore()
	const editing = useLayoutEditStore(state => state.editing)
	const saveEditing = useLayoutEditStore(state => state.saveEditing)
	const cancelEditing = useLayoutEditStore(state => state.cancelEditing)
	const [currentTime, setCurrentTime] = useState(new Date())
	const [searchQuery, setSearchQuery] = useState('')

	const handleSave = () => {
		saveEditing()
		toast.success('首页布局偏移已保存（尚未提交到远程配置）')
	}

	const handleCancel = () => {
		cancelEditing()
		toast.info('已取消此次拖拽布局修改')
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === ',')) {
				e.preventDefault()
				setConfigDialogOpen(true)
			}
		}

		const updateTime = () => setCurrentTime(new Date())

		window.addEventListener('keydown', handleKeyDown)
		const timeInterval = setInterval(updateTime, 1000)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			clearInterval(timeInterval)
		}
	}, [setConfigDialogOpen])

	const hours = currentTime.getHours().toString().padStart(2, '0')
	const minutes = currentTime.getMinutes().toString().padStart(2, '0')
	const timeString = `${hours}:${minutes}`

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			window.open(`https://cn.bing.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank')
		}
	}

	const quickLinks = [
		{ icon: BookOpen, label: '博客', href: '/blog', color: 'bg-blue-500' },
		{ icon: FolderTree, label: '项目', href: '/projects', color: 'bg-purple-500' },
		{ icon: Code2, label: '代码片段', href: '/snippets', color: 'bg-green-500' },
		{ icon: Calendar, label: '关于', href: '/about', color: 'bg-orange-500' }
	]

	return (
		<>
			{siteContent.enableChristmas && <SnowfallBackground zIndex={0} count={!maxSM ? 125 : 20} />}

			{editing && (
				<div className='pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-6'>
					<div className='pointer-events-auto flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-2 shadow-lg backdrop-blur'>
						<span className='text-xs text-gray-600'>正在编辑首页布局，拖拽卡片调整位置</span>
						<div className='flex gap-2'>
							<motion.button
								type='button'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleCancel}
								className='rounded-xl border bg-white px-3 py-1 text-xs font-medium text-gray-700'>
								取消
							</motion.button>
							<motion.button type='button' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} className='brand-btn px-3 py-1 text-xs'>
								保存偏移
							</motion.button>
						</div>
					</div>
				</div>
			)}

			<div className='min-h-screen w-full'>
				<div className='flex flex-col items-center justify-center space-y-12 px-4 py-12 max-md:space-y-8'>
					<div className='text-center'>
						<h1 className='text-8xl font-bold tracking-tight md:text-9xl lg:text-[160px]'>{timeString}</h1>
						<p className='mt-4 text-2xl text-gray-600 md:text-3xl lg:text-4xl'>
							{currentTime.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
						</p>
					</div>

					<form onSubmit={handleSearch} className='w-full max-w-3xl'>
						<div className='relative'>
							<Search className='absolute left-6 top-1/2 h-7 w-7 -translate-y-1/2 text-gray-400' />
							<input
								type='text'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								placeholder='搜索 Bing...'
								className='w-full rounded-3xl border-0 bg-white/80 px-6 py-5 pl-16 text-xl shadow-lg backdrop-blur-sm outline-none transition-all focus:scale-[1.02] focus:shadow-xl dark:bg-gray-800/80 max-md:py-4 max-md:pl-14 max-md:text-lg'
								autoFocus
							/>
						</div>
					</form>

					<div className='flex flex-wrap justify-center gap-5 max-md:gap-4'>
						{quickLinks.map((link, index) => (
							<Link
								key={index}
								href={link.href}
								className='flex items-center gap-3 rounded-2xl bg-white/80 px-8 py-5 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl dark:bg-gray-800/80 max-md:px-6 max-md:py-4'>
								<div className={`rounded-xl p-3 ${link.color}`}>
									<link.icon className='h-7 w-7 text-white max-md:h-6 max-md:w-6' />
								</div>
								<span className='text-xl font-medium max-md:text-lg'>{link.label}</span>
							</Link>
						))}
					</div>

					<div className='mt-8'>
						{cardStyles.hiCard?.enabled !== false && <HiCard />}
					</div>

					<div className='flex flex-wrap items-center justify-center gap-4 max-sm:flex-col'>
						{cardStyles.socialButtons?.enabled !== false && <SocialButtons />}
					</div>
				</div>

				<div className='mx-auto max-w-6xl px-4 py-8'>
					<div className='max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-6 max-sm:pt-28 max-sm:pb-20'>
						{cardStyles.artCard?.enabled !== false && <ArtCard />}
						{!maxSM && cardStyles.clockCard?.enabled !== false && <ClockCard />}
						{!maxSM && cardStyles.calendarCard?.enabled !== false && <CalendarCard />}
						{!maxSM && cardStyles.shareCard?.enabled !== false && <ShareCard />}
						{cardStyles.articleCard?.enabled !== false && <AritcleCard />}
						{!maxSM && cardStyles.writeButtons?.enabled !== false && <WriteButtons />}
						{cardStyles.likePosition?.enabled !== false && <LikePosition />}
						{cardStyles.hatCard?.enabled !== false && <HatCard />}
						{cardStyles.beianCard?.enabled !== false && <BeianCard />}
					</div>
				</div>
			</div>

			{siteContent.enableChristmas && <SnowfallBackground zIndex={2} count={!maxSM ? 125 : 20} />}
			<ConfigDialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} />
		</>
	)
}
