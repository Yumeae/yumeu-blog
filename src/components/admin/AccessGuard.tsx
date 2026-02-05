import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function AccessGuard({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		checkAccess()
	}, [])

	const checkAccess = async () => {
		try {
			const res = await fetch('/admin/api/verify-access', {
				credentials: 'include'
			})

			if (res.ok) {
				setIsAuthenticated(true)
			} else {
				window.location.href = 'https://dash.cloudflare.com/iam/access/new-application'
			}
		} catch (error) {
			console.error('Failed to check access:', error)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<div className='text-center'>
					<div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
					<p className='text-slate-600'>验证访问权限中...</p>
				</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-slate-50'>
				<div className='mx-auto max-w-md p-6 text-center'>
					<AlertTriangle className='mx-auto mb-4 h-16 w-16 text-yellow-500' />
					<h2 className='mb-4 text-2xl font-bold'>需要访问权限</h2>
					<p className='mb-6 text-slate-600'>您需要通过 Cloudflare Access 认证才能访问此页面。</p>
					<a href='/admin/api/login' className='inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700'>
						使用 Cloudflare Access 登录
					</a>
				</div>
			</div>
		)
	}

	return <>{children}</>
}
