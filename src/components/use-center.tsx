export function useCenterStore() {
	if (typeof window === 'undefined') {
		return {
			x: 500,
			y: 300
		}
	}
	return {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2
	}
}
