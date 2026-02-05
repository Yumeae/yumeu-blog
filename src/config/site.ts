import type { SiteConfig } from '@/types/site'

export const siteConfig: SiteConfig = {
	name: 'My Blog',
	description: '欢迎来到我的博客',
	navItems: [
		{ label: '首页', href: '/', icon: 'home' },
		{ label: '文章', href: '/posts', icon: 'file-text' },
		{ label: '分类', href: '/categories', icon: 'folder' },
		{ label: '标签', href: '/tags', icon: 'tag' },
		{ label: '关于', href: '/about', icon: 'user' }
	]
}
