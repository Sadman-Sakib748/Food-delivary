'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag, Heart, Share2, Clock } from 'lucide-react'
import { blogAPI } from '@/lib/api'
import { Blog } from '@/types'
import { formatDate } from '@/lib/api/utils'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchBlog()
    }
  }, [slug])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await blogAPI.getBySlug(slug)
      setBlog(response.data || response)
    } catch (error) {
      console.error('Error fetching blog:', error)
      router.push('/blog')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    try {
      await blogAPI.like(blog!._id)
      setBlog(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null)
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Blog post not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      <article>
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {blog.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {blog.readingTime || 3} min read
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4" />
            <span>{typeof blog.author === 'object' ? blog.author.name : blog.author}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl h-64 flex items-center justify-center text-8xl mb-8">
          📝
        </div>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {blog.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-100">
          <Button variant="outline" onClick={handleLike}>
            <Heart className={`w-4 h-4 mr-2 ${blog.likes && blog.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
            {blog.likes || 0} Likes
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </article>
    </div>
  )
}