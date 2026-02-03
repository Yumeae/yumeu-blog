type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

export async function recordAnalyticsEvent(env: CloudflareBindings, event: string, payload: AnalyticsPayload = {}) {
	const dataset = env.WORKERS_ANALYTICS
	if (!dataset) return
	try {
		const indexes = [event]
		const serialized = JSON.stringify({ event, ...payload, timestamp: new Date().toISOString() })
		const blob = new TextEncoder().encode(serialized)
		await dataset.writeDataPoint({ indexes, blobs: [blob] })
	} catch (error) {
		console.error('写入 Workers Analytics 失败', error)
	}
}
