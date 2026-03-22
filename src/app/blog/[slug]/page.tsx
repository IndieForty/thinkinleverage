import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/content'
import { markdownToHtml, extractHeadings } from '@/lib/markdown'
import { siteConfig } from '@/lib/config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import OptimizedMedia from '@/components/OptimizedMedia'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  const imageUrl = post.featured_image?.startsWith('/') ? `${siteConfig.url}${post.featured_image}` : post.featured_image
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author, url: `${siteConfig.url}/author/${post.authorSlug}` }],
    openGraph: {
      title: post.title, description: post.description, type: 'article',
      publishedTime: post.date, authors: [post.author],
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: imageUrl ? [imageUrl] : undefined },
    alternates: { canonical: `${siteConfig.url}/blog/${slug}` },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(post, 4)
  const headings = extractHeadings(post.content)
  const bodyHtml = markdownToHtml(post.content)
  const imageUrl = post.featured_image?.startsWith('/') ? `${siteConfig.url}${post.featured_image}` : post.featured_image

  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: post.description,
    datePublished: post.date, dateModified: post.date,
    author: { '@type': 'Person', name: post.author, url: `${siteConfig.url}/author/${post.authorSlug}` },
    publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    image: imageUrl || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteConfig.url}/blog/${slug}` },
    wordCount: post.word_count,
    articleSection: post.categories[0] || 'General',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteConfig.url}/blog/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="max-w-3xl mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
            {post.categories[0] && (<><li aria-hidden="true">/</li>
              <li><Link href={`/category/${post.categories[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-blue-600">{post.categories[0]}</Link></li></>
            )}
            <li aria-hidden="true">/</li>
            <li className="text-gray-400 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-3 mt-5">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <Link href={`/author/${post.authorSlug}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                {post.author}
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {post.date && <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' })}</time>}
                <span>·</span>
                <span>{post.reading_time} min read</span>
                <span>·</span>
                <span>{post.word_count.toLocaleString()} words</span>
              </div>
            </div>
          </div>

          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.categories.map(cat => (
                <Link key={cat} href={`/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors">
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Featured image - uses OptimizedMedia for GIF->MP4 conversion */}
        {post.featured_image && (
          <figure className="mb-8">
            <OptimizedMedia src={post.featured_image} alt={post.title} className="w-full rounded-lg" priority={true} />
          </figure>
        )}

        {/* Table of contents */}
        {headings.length > 2 && (
          <nav className="bg-gray-50 rounded-lg p-5 mb-8" aria-label="Table of contents">
            <p className="text-sm font-semibold text-gray-900 mb-3">In this article</p>
            <ol className="space-y-1.5 text-sm">
              {headings.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="text-gray-600 hover:text-blue-600">{h.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {/* Author box */}
        <aside className="border-t border-gray-100 mt-12 pt-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm text-gray-500">Written by</p>
              <Link href={`/author/${post.authorSlug}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                {post.author}
              </Link>
              <p className="text-sm text-gray-600 mt-1">
                Founder of {siteConfig.name}. Writing about B2B growth, marketing strategy, and Ireland&apos;s digital economy.
              </p>
            </div>
          </div>
        </aside>

        {/* Related posts */}
        {related.length > 0 && (
          <aside className="border-t border-gray-100 mt-10 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Related articles</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group block p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">{r.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{r.description}</p>
                  <span className="text-xs text-gray-400 mt-2 block">{r.reading_time} min read</span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </article>
    </>
  )
}
