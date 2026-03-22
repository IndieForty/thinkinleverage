import { getAllCategories, getPostsByCategory } from '@/lib/content'
import { siteConfig } from '@/lib/config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = getAllCategories().find(c => c.slug === slug)
  if (!cat) return {}
  return {
    title: `${cat.name} Articles`,
    description: `Browse ${cat.postCount} articles about ${cat.name} on ${siteConfig.name}.`,
    alternates: { canonical: `${siteConfig.url}/category/${slug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const cat = getAllCategories().find(c => c.slug === slug)
  if (!cat) notFound()

  const posts = getPostsByCategory(slug)

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
      { '@type': 'ListItem', position: 3, name: cat.name, item: `${siteConfig.url}/category/${slug}` },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: `${cat.name} Articles`, description: `Articles about ${cat.name}`,
    url: `${siteConfig.url}/category/${slug}`,
    isPartOf: { '@type': 'WebSite', name: siteConfig.name, url: siteConfig.url },
    numberOfItems: posts.length,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-400">{cat.name}</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{cat.name}</h1>
        <p className="text-gray-600 mb-10">{posts.length} articles</p>

        <div className="grid gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="group border-b border-gray-100 pb-6">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-1">
                  {post.date && <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' })}</time>}
                  <span>{post.reading_time} min read</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                <p className="mt-1 text-gray-600 text-sm line-clamp-2">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
