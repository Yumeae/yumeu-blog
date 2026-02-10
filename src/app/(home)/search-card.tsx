import { useCenterStore } from '@/hooks/use-center'
import Card from '@/components/card'
import { useConfigStore } from './stores/config-store'
import { HomeDraggableLayer } from './home-draggable-layer'
import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchCard() {
	const center = useCenterStore()
	const { cardStyles } = useConfigStore()
	const styles = cardStyles.searchCard || { width: 640, height: 80, offsetX: null, offsetY: null, order: 1, enabled: true }
	const [searchQuery, setSearchQuery] = useState('')

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x - styles.width / 2
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - styles.height / 2

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			window.open(`https://cn.bing.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank')
		}
	}

	return (
		<HomeDraggableLayer cardKey='searchCard' x={x} y={y} width={styles.width} height={styles.height}>
			<Card order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='max-sm:static max-sm:translate-0'>
				<form onSubmit={handleSearch} className='flex h-full items-center gap-4 px-6'>
					<Search className='h-6 w-6 flex-shrink-0 text-gray-400' />
					<input
						type='text'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						placeholder='搜索 Bing...'
						className='flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400'
						autoFocus
					/>
					<button
						type='submit'
						className='flex-shrink-0 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg'>
						搜索
					</button>
				</form>
			</Card>
		</HomeDraggableLayer>
	)
}
