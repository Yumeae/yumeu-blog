export function useCenterStore() {
	return {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2
	}
}

export function useConfigStore() {
	return {
		cardStyles: {
			hiCard: {
				enabled: true,
				order: 0,
				width: 280,
				height: 280,
				offsetX: null,
				offsetY: null
			},
			socialButtons: {
				enabled: true,
				order: 1,
				width: 'auto',
				height: 48,
				offsetX: null,
				offsetY: null
			},
			artCard: {
				enabled: true,
				order: 2,
				width: 200,
				height: 160,
				offsetX: null,
				offsetY: null
			},
			clockCard: {
				enabled: true,
				order: 3,
				width: 160,
				height: 160,
				offsetX: null,
				offsetY: null
			},
			calendarCard: {
				enabled: true,
				order: 4,
				width: 160,
				height: 160,
				offsetX: null,
				offsetY: null
			}
		},
		siteContent: {
			meta: {
				username: 'Suni',
				title: 'My Blog',
				description: 'Welcome to my blog'
			},
			socialButtons: [
				{ id: '1', type: 'github', value: 'https://github.com', order: 0 },
				{ id: '2', type: 'email', value: 'example@email.com', order: 1 }
			],
			enableChristmas: false
		}
	}
}
