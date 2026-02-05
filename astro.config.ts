import type { AstroConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

const config: AstroConfig = {
	site: 'https://your-blog-domain.pages.dev',
	integrations: [
		tailwind({
			applyBaseStyles: false
		}),
		react()
	],
	adapter: cloudflare({
		mode: 'directory',
		functionPerRoute: false
	}),
	output: 'static',
	vite: {
		build: {
			rollupOptions: {
				output: {
					assetFileNames: 'assets/[hash][extname]',
					chunkFileNames: 'assets/[hash].js',
					entryFileNames: 'assets/[hash].js'
				}
			}
		}
	}
}

export default config
