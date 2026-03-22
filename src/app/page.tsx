import { getAllPosts, getAllCategories } from '@/lib/content'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import OptimizedMedia from '@/components/OptimizedMedia'

export default function HomePage() {
  const posts = getAllPosts()
  const featured = posts.slice(0, 3)
  const recent = posts.slice(3, 15)
  const categories = getAllCategories()

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          {siteConfig.tagline}
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl">{siteConfig.description}</p>
      </section>

      {/* Featured posts */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {featured.map((post, i) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                {post.featured_image && (
                  <OptimizedMedia src={post.featured_image} alt={post.title} className="w-full h-40 object-cover rounded-lg mb-3" priority={i === 0} />
                )}
                <div className="text-xs text-gray-500 mb-1">
                  {post.date && <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IE', { month: 'short', day: 'numeric' })}</time>}
                  {post.categories[0] && <span className="ml-2 text-blue-600">{post.categories[0]}</span>}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Recent + sidebar */}
      <div className="grid lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Latest articles</h2>
          <div className="grid gap-6">
            {recent.map((post) => (
              <article key={post.slug} className="group border-b border-gray-100 pb-5">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    {post.date && <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' })}</time>}
                    <span>·</span><span>{post.reading_time} min</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.description}</p>
                </Link>
              </article>
            ))}
          </div>
          <Link href="/blog" className="inline-block mt-6 text-blue-600 hover:text-blue-800 font-medium text-sm">
            View all {posts.length} articles →
          </Link>
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                    {cat.name} ({cat.postCount})
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">About {siteConfig.name}</h3>
              <p className="text-sm text-gray-600">{siteConfig.description}</p>
              <Link href="/about" className="text-sm text-blue-600 hover:text-blue-800 mt-3 inline-block">Learn more →</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
