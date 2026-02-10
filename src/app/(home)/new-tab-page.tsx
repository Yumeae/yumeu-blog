'use client'

import { useState } from 'react'
import { Search, Calendar, BookOpen, FolderTree, Code2 } from 'lucide-react'
import Link from 'next/link'

export default function NewTabPage() {
	const [searchQuery, setSearchQuery] = useState('')

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank')
		}
	}

	const quickLinks = [
		{ icon: BookOpen, label: '博客', href: '/blog', color: 'bg-blue-500' },
		{ icon: FolderTree, label: '项目', href: '/projects', color: 'bg-purple-500' },
		{ icon: Code2, label: '代码片段', href: '/snippets', color: 'bg-green-500' },
		{ icon: Calendar, label: '关于', href: '/about', color: 'bg-orange-500' }
	]

	return (
		<div className='flex min-h-screen flex-col items-center justify-center px-4'>
			<div className='w-full max-w-2xl space-y-12'>
				<div className='text-center'>
					<div id='large-clock' className='text-8xl font-bold tracking-tight md:text-9xl'></div>
					<p id='date-display' className='mt-4 text-2xl text-gray-600'></p>
				</div>

				<form onSubmit={handleSearch} className='relative'>
					<div className='relative'>
						<Search className='absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400' />
						<input
							type='text'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							placeholder='搜索 Google...'
							className='w-full rounded-2xl border-0 bg-white/80 px-6 py-4 pl-14 text-lg shadow-lg backdrop-blur-sm outline-none transition-all focus:scale-[1.02] focus:shadow-xl dark:bg-gray-800/80'
							autoFocus
						/>
					</div>
				</form>

				<div className='flex flex-wrap justify-center gap-4'>
					{quickLinks.map((link, index) => (
						<Link
							key={index}
							href={link.href}
							className='flex items-center gap-3 rounded-xl bg-white/80 px-6 py-4 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl dark:bg-gray-800/80'>
							<div className={`rounded-lg p-2 ${link.color}`}>
								<link.icon className='h-6 w-6 text-white' />
							</div>
							<span className='text-lg font-medium'>{link.label}</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}
