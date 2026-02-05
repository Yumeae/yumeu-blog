export interface NavItem {
	label: string
	href: string
	icon?: string
}

export interface SiteConfig {
	name: string
	description: string
	navItems: NavItem[]
}
