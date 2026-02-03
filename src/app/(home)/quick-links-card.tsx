import { useCenterStore } from '@/hooks/use-center'
import Card from '@/components/card'
import { useConfigStore } from './stores/config-store'
import { HomeDraggableLayer } from './home-draggable-layer'
import Link from 'next/link'
import { BookOpen, FolderTree, Code2, Calendar, Home, FileText, Image, Music, Share2, Settings, Star, Heart } from 'lucide-react'

export default function QuickLinksCard() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const styles = cardStyles.quickLinksCard || { width: 600, height: 140, offsetX: null, offsetY: null, order: 3, enabled: true }

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x - styles.width / 2
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - styles.height / 2

	const iconMap: Record<string, any> = {
		BookOpen,
		FolderTree,
		Code2,
		Calendar,
		Home,
		FileText,
		Image,
		Music,
		Share2,
		Settings,
		Star,
		Heart
	}

	const defaultLinks = [
		{ icon: 'BookOpen', label: '博客', href: '/blog', color: 'bg-blue-500' },
		{ icon: 'FolderTree', label: '项目', href: '/projects', color: 'bg-purple-500' },
		{ icon: 'Code2', label: '代码片段', href: '/snippets', color: 'bg-green-500' },
		{ icon: 'Calendar', label: '关于', href: '/about', color: 'bg-orange-500' }
	]

	const customLinks = (siteContent.quickLinks as any) || defaultLinks

	return (
		<HomeDraggableLayer cardKey='quickLinksCard' x={x} y={y} width={styles.width} height={styles.height}>
			<Card order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='max-sm:static max-sm:translate-0'>
				<div className='flex h-full flex-wrap items-center justify-center gap-4 px-4 py-4'>
					{customLinks.map((link: any, index: number) => {
						const IconComponent = iconMap[link.icon] || BookOpen
						return (
							<Link
								key={index}
								href={link.href}
								className='flex min-w-[120px] flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-white/60 px-4 py-3 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/80 hover:shadow-md'>
								<div className={`rounded-lg p-2 ${link.color}`}>
									<IconComponent className='h-5 w-5 text-white' />
								</div>
								<span className='text-sm font-medium'>{link.label}</span>
							</Link>
						)
					})}
				</div>
			</Card>
		</HomeDraggableLayer>
	)
}
