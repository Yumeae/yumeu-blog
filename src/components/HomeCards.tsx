import HiCard from './HiCard'
import ArticleCard from './ArticleCard'
import ClockCard from './ClockCard'
import CalendarCard from './CalendarCard'
import ShareCard from './ShareCard'
import LikePosition from './LikePosition'
import HHatCard from './HatCard'
import BeianCard from './BeianCard'

export default function HomeCards() {
	return (
		<div className='relative min-h-screen overflow-hidden'>
			<HiCard />
			<ArticleCard />
			<ClockCard />
			<CalendarCard />
			<ShareCard />
			<LikePosition />
			<HHatCard />
			<BeianCard />
		</div>
	)
}
