import { useRef, useState, useEffect } from 'react'

interface Props {
	children: React.ReactNode
	cardKey: string
	x: number
	y: number
	width: number | string
	height: number
}

export { Props as HomeDraggableLayerProps }

export default function HomeDraggableLayer({ children, cardKey, x, y, width, height }: Props) {
	const [isDragging, setIsDragging] = useState(false)
	const [position, setPosition] = useState({ x, y })
	const dragRef = useRef<HTMLDivElement>(null)
	const dragStartRef = useRef({ x: 0, y: 0 })

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true)
		dragStartRef.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y
		}
	}

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				setPosition({
					x: e.clientX - dragStartRef.current.x,
					y: e.clientY - dragStartRef.current.y
				})
			}
		}

		const handleMouseUp = () => {
			setIsDragging(false)
		}

		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging])

	return (
		<div
			ref={dragRef}
			onMouseDown={handleMouseDown}
			style={{
				position: 'absolute',
				left: position.x,
				top: position.y,
				width: typeof width === 'number' ? `${width}px` : width,
				height: typeof height === 'number' ? `${height}px` : `${height}px`,
				cursor: isDragging ? 'grabbing' : 'grab',
				zIndex: isDragging ? 1000 : 1
			}}>
			{children}
		</div>
	)
}
