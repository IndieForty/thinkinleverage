import { getAllPosts, getAllCategories } from '@/lib/content'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import type { Metadata } from 'next'

const POSTS_PER_PAGE = 20

export const metadata: Metadata = {
  title: 'Blog',
  description: `Latest articles on B2B growth, marketing, and Ireland's digital economy.`,
  alternates: { canonical: `${siteConfig.url}/blog` },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const currentPosts = posts.slice(0, POSTS_PER_PAGE)

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="mt-2 text-gray-600">{posts.length} articles published</p>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/blog" className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-full">All</Link>
        {categories.slice(0, 10).map(cat => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}
            className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
            {cat.name} ({cat.postCount})
          </Link>
        ))}
      </div>

      <div className="grid gap-6">
        {currentPosts.map((post) => (
          <article key={post.slug} className="group border-b border-gray-100 pb-6">
            <Link href={`/blog/${post.slug}`} className="flex gap-5">
              {post.featured_image && (
                <img src={post.featured_image} alt="" className="w-24 h-24 object-cover rounded-lg flex-shrink-0 hidden sm:block" loading="lazy" />
              )}
              <div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-1.5">
                  {post.date && <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' })}</time>}
                  <span>{post.reading_time} min read</span>
                  {post.categories[0] && <span className="text-blue-600">{post.categories[0]}</span>}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                <p className="mt-1 text-gray-600 text-sm line-clamp-2">{post.description}</p>
                <p className="mt-1.5 text-xs text-gray-400">By <span className="text-gray-500">{post.author}</span></p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Pagination note — for static export, show all posts */}
      {posts.length > POSTS_PER_PAGE && (
        <div className="mt-8 grid gap-4">
          {posts.slice(POSTS_PER_PAGE).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {post.date && <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' })}</time>}
                <span>{post.reading_time} min</span>
              </div>
              <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600">{post.title}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
