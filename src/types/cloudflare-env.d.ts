type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonPrimitive[] | { [key: string]: JsonValue }

interface KVNamespaceGetOptions {
	type?: 'text' | 'json' | 'arrayBuffer'
	cacheTtl?: number
}

interface KVNamespaceListResult {
	keys: { name: string; expiration?: number; metadata?: JsonValue }[]
	list_complete: boolean
	cursor?: string
}

interface KVNamespace {
	get(key: string, options?: KVNamespaceGetOptions & { type: 'text' }): Promise<string | null>
	get(key: string, options?: KVNamespaceGetOptions & { type: 'json' }): Promise<JsonValue | null>
	get(key: string, options?: KVNamespaceGetOptions & { type: 'arrayBuffer' }): Promise<ArrayBuffer | null>
	get(key: string, options?: KVNamespaceGetOptions): Promise<string | null>
	put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: { expiration?: number; expirationTtl?: number; metadata?: JsonValue }): Promise<void>
	delete(key: string): Promise<void>
	list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<KVNamespaceListResult>
}

interface R2Object {
	key: string
	version?: string
	size: number
	uploaded: string
	httpEtag?: string
	httpMetadata?: Record<string, string>
	customMetadata?: Record<string, string>
}

interface R2ObjectBody extends R2Object {
	body: ReadableStream
	arrayBuffer(): Promise<ArrayBuffer>
	text(): Promise<string>
	json<T = JsonValue>(): Promise<T>
}

interface R2BucketPutOptions {
	httpMetadata?: { contentType?: string; contentDisposition?: string }
	customMetadata?: Record<string, string>
}

interface R2Bucket {
	put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string, options?: R2BucketPutOptions): Promise<R2Object | null>
	get(key: string): Promise<R2ObjectBody | null>
	delete(key: string): Promise<void>
	head(key: string): Promise<R2Object | null>
}

interface AnalyticsEngineDataset {
	writeDataPoint(data: {
		blobs?: (ArrayBuffer | ArrayBufferView)[]
		indexes?: string[]
		integers?: number[]
		doubles?: number[]
	}): Promise<void>
}

interface CloudflareEnv {
	CONTENT_KV: KVNamespace
	MEDIA_BUCKET: R2Bucket
	WORKERS_ANALYTICS?: AnalyticsEngineDataset
	ACCESS_AUD?: string
	ACCESS_TEAM_DOMAIN?: string
	ACCESS_EMAIL_ALLOWLIST?: string
	MEDIA_PUBLIC_BASE_URL?: string
	MEDIA_R2_PREFIX?: string
}

declare type CloudflareBindings = CloudflareEnv

declare global {
	// During Next dev server we polyfill bindings onto globalThis for testing
	// eslint-disable-next-line no-var
	var __CLOUDFLARE_ENV__?: CloudflareBindings
}

export {}
