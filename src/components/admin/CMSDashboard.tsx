import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, LogOut } from 'lucide-react'
import type { Post } from '@/types'

export default function CMSDashboard() {
	const [posts, setPosts] = useState<Post[]>([])
	const [selectedPost, setSelectedPost] = useState<Post | null>(null)
	const [showEditor, setShowEditor] = useState(false)

	useEffect(() => {
		fetchPosts()
	}, [])

	const fetchPosts = async () => {
		try {
			const res = await fetch('/admin/api/posts')
			const data = await res.json()
			setPosts(data.items || [])
		} catch (error) {
			console.error('Failed to fetch posts:', error)
		}
	}

	const handleCreate = () => {
		setSelectedPost({
			slug: '',
			title: '',
			description: '',
			content: '',
			publishedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			status: 'draft'
		})
		setShowEditor(true)
	}

	const handleEdit = (post: Post) => {
		setSelectedPost(post)
		setShowEditor(true)
	}

	const handleDelete = async (slug: string) => {
		if (!confirm('确定要删除这篇文章吗？')) return

		try {
			await fetch(`/admin/api/posts/${slug}`, { method: 'DELETE' })
			await fetchPosts()
		} catch (error) {
			console.error('Failed to delete post:', error)
		}
	}

	if (showEditor && selectedPost) {
		return (
			<PostEditor
				post={selectedPost}
				onSave={async post => {
					const isNew = !selectedPost.slug
					const method = isNew ? 'POST' : 'PUT'
					const url = isNew ? '/admin/api/posts' : `/admin/api/posts/${post.slug}`

					await fetch(url, {
						method,
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(post)
					})

					await fetchPosts()
					setShowEditor(false)
					setSelectedPost(null)
				}}
				onCancel={() => {
					setShowEditor(false)
					setSelectedPost(null)
				}}
			/>
		)
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8 flex items-center justify-between'>
				<h1 className='text-3xl font-bold'>CMS 管理后台</h1>
				<div className='flex gap-4'>
					<button onClick={handleCreate} className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
						<Plus className='h-4 w-4' />
						新建文章
					</button>
				</div>
			</div>

			{posts.length === 0 ? (
				<div className='rounded-lg bg-white py-12 text-center shadow dark:bg-slate-800'>
					<h2 className='mb-4 text-xl font-bold'>暂无文章</h2>
					<p className='mb-6 text-slate-600 dark:text-slate-400'>点击上方按钮创建您的第一篇文章</p>
					<p className='text-sm text-slate-500'>提示: 旧版博客文章不会自动迁移，您可以手动导入内容</p>
				</div>
			) : (
				<div className='overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800'>
					<table className='w-full'>
						<thead className='bg-slate-50 dark:bg-slate-700'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'>标题</th>
								<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'>状态</th>
								<th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'>发布时间</th>
								<th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500'>操作</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
							{posts.map(post => (
								<tr key={post.slug}>
									<td className='whitespace-nowrap px-6 py-4'>
										<div className='text-sm font-medium'>{post.title}</div>
										<div className='text-sm text-slate-500'>{post.slug}</div>
									</td>
									<td className='whitespace-nowrap px-6 py-4'>
										<span
											className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
												post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
											}`}>
											{post.status === 'published' ? '已发布' : '草稿'}
										</span>
									</td>
									<td className='whitespace-nowrap px-6 py-4 text-sm text-slate-500'>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</td>
									<td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
										<button onClick={() => handleEdit(post)} className='mr-4 text-blue-600 hover:text-blue-900'>
											<Edit className='h-4 w-4' />
										</button>
										<button onClick={() => handleDelete(post.slug)} className='text-red-600 hover:text-red-900'>
											<Trash2 className='h-4 w-4' />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

interface PostEditorProps {
	post: Post
	onSave: (post: Post) => Promise<void>
	onCancel: () => void
}

function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
	const [formData, setFormData] = useState(post)
	const [uploading, setUploading] = useState(false)

	const handleSubmit = async () => {
		if (!formData.title || !formData.content) {
			alert('请填写标题和内容')
			return
		}

		if (!confirm('确定要发布这篇文章吗？')) return

		await onSave(formData)
	}

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		try {
			setUploading(true)
			const formDataUpload = new FormData()
			formDataUpload.append('file', file)

			const res = await fetch('/admin/api/media', {
				method: 'POST',
				body: formDataUpload
			})

			const data = await res.json()
			setFormData({ ...formData, heroImageUrl: data.url })
		} catch (error) {
			console.error('Failed to upload image:', error)
			alert('图片上传失败')
		} finally {
			setUploading(false)
		}
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8'>
				<button onClick={onCancel} className='mb-4 text-slate-600 hover:text-slate-900'>
					← 返回列表
				</button>
				<h1 className='text-3xl font-bold'>{formData.slug ? '编辑文章' : '新建文章'}</h1>
			</div>

			<div className='space-y-6 rounded-lg bg-white p-6 shadow dark:bg-slate-800'>
				<div>
					<label className='mb-2 block text-sm font-medium'>标题</label>
					<input
						type='text'
						value={formData.title}
						onChange={e => setFormData({ ...formData, title: e.target.value })}
						className='w-full rounded-lg border px-4 py-2 dark:border-slate-600 dark:bg-slate-700'
					/>
				</div>

				<div>
					<label className='mb-2 block text-sm font-medium'>描述</label>
					<textarea
						value={formData.description}
						onChange={e => setFormData({ ...formData, description: e.target.value })}
						className='w-full rounded-lg border px-4 py-2 dark:border-slate-600 dark:bg-slate-700'
						rows={3}
					/>
				</div>

				<div>
					<label className='mb-2 block text-sm font-medium'>封面图片</label>
					{formData.heroImageUrl && <img src={formData.heroImageUrl} alt='封面' className='mb-4 h-48 w-full rounded-lg object-cover' />}
					<input
						type='file'
						accept='image/*'
						onChange={handleImageUpload}
						className='block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100'
						disabled={uploading}
					/>
				</div>

				<div>
					<label className='mb-2 block text-sm font-medium'>内容 (Markdown)</label>
					<textarea
						value={formData.content}
						onChange={e => setFormData({ ...formData, content: e.target.value })}
						className='w-full rounded-lg border px-4 py-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-700'
						rows={20}
					/>
				</div>

				<div className='flex justify-end gap-4'>
					<button onClick={onCancel} className='rounded-lg border px-6 py-2 hover:bg-slate-50 dark:hover:bg-slate-700'>
						取消
					</button>
					<button onClick={handleSubmit} className='rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'>
						发布
					</button>
				</div>
			</div>
		</div>
	)
}
