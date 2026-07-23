'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Calendar, User, Tag } from 'lucide-react'
import { blogAPI } from '@/lib/api'
import { Blog } from '@/types'
import { formatDate, truncateText } from '@/lib/api/utils'
import Input from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 0 })

  useEffect(() => {
    fetchBlogs()
  }, [search])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await blogAPI.getAll({ search, page: pagination.page, limit: pagination.limit })
      setBlogs(response.data || [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        <p className="text-gray-600 mt-1">Food tips, recipes, and news</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4 text-gray-400" />}
          />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
          <option value="">All Categories</option>
          <option value="food">Food</option>
          <option value="health">Health</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="recipes">Recipes</option>
          <option value="tips">Tips</option>
          <option value="news">News</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link key={blog._id} href={`/blog/${blog.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-amber-500 rounded-t-xl flex items-center justify-center text-6xl">
                📝
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {blog.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(blog.createdAt)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm">{truncateText(blog.excerpt || blog.content, 100)}</p>
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>{typeof blog.author === 'object' ? blog.author.name : blog.author}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}