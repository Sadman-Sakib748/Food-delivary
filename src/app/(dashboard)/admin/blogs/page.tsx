'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, Plus, Edit, Trash2, Eye, FileText } from 'lucide-react'
import { adminAPI } from '@/lib/api'
import { Blog } from '@/types'
import { formatDate, truncateText } from '@/lib/api/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import toast from 'react-hot-toast'

export default function AdminBlogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/unauthorized')
      return
    }
    if (status === 'authenticated') {
      fetchBlogs()
    }
  }, [status, session, router, search, statusFilter, categoryFilter])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getBlogs({ 
        search, 
        status: statusFilter,
        category: categoryFilter,
        page: pagination.page, 
        limit: pagination.limit 
      })
      setBlogs(response.data || [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await adminAPI.deleteBlog(id)
        toast.success('Blog deleted successfully!')
        await fetchBlogs()
      } catch (error) {
        console.error('Error deleting blog:', error)
        toast.error('Failed to delete blog')
      }
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      // Use the togglePublish method instead
      await adminAPI.togglePublish(id)
      toast.success(`Blog ${currentStatus ? 'unpublished' : 'published'} successfully!`)
      await fetchBlogs()
    } catch (error) {
      console.error('Error toggling blog status:', error)
      toast.error('Failed to toggle blog status')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Manage all blog posts on the platform</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Blog
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="food">Food</option>
            <option value="health">Health</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="recipes">Recipes</option>
            <option value="tips">Tips</option>
            <option value="news">News</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <Card key={blog._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{truncateText(blog.title, 40)}</h3>
                  <p className="text-sm text-gray-500 mt-1">{truncateText(blog.excerpt || blog.content, 80)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {blog.category}
                    </span>
                    {blog.isPublished ? (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">Published</span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-600 rounded-full">Draft</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(blog.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-1 ml-2">
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-orange-600 hover:bg-orange-50 rounded" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(blog._id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded" 
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
                  className={`text-xs font-medium ${
                    blog.isPublished ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  {blog.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </Card>
          ))}
        </div>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {blogs.length} of {pagination.total} blogs
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}