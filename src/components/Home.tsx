import { useConfigStore } from './config-store'
import { useCenterStore } from './use-center'
import HiCard from './HiCard'
import { motion } from 'motion/react'

export default function Home() {
	const { cardStyles, siteContent } = useConfigStore()
	const center = useCenterStore()

	return (
		<div className='relative min-h-screen'>
			{siteContent.enableChristmas && <div className='pointer-events-none fixed inset-0 z-0'></div>}

			<div className='relative z-10 flex flex-col items-center gap-6 pb-20 pt-12'>
				{cardStyles.hiCard?.enabled !== false && <HiCard />}

				<div className='pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center pt-6'>
					<div className='pointer-events-auto rounded-xl bg-white/80 px-4 py-2 shadow-lg backdrop-blur'>
						<span className='text-xs text-gray-600'>拖拽卡片可调整位置</span>
					</div>
				</div>
			</div>
		</div>
	)
}
