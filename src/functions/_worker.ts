import { handleRequest } from './api'

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		return handleRequest(request, env)
	}
} satisfies ExportedHandler<Env>
