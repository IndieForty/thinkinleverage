import { getAllAuthors, getPostsByAuthor } from '@/lib/content'
import { siteConfig } from '@/lib/config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const authors = getAllAuthors()
  const author = authors.find(a => a.slug === slug)
  if (!author) return {}
  return {
    title: `${author.name} – Author`,
    description: `Articles by ${author.name} on ${siteConfig.name}. ${author.bio}`,
    alternates: { canonical: `${siteConfig.url}/author/${slug}` },
  }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  const authors = getAllAuthors()
  const author = authors.find(a => a.slug === slug)
  if (!author) notFound()

  const posts = getPostsByAuthor(slug)

  const personSchema = {
    '@context': 'https://schema.org', '@type': 'Person',
    name: author.name, url: `${siteConfig.url}/author/${slug}`,
    description: author.bio,
    worksFor: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: author.name, item: `${siteConfig.url}/author/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-400">{author.name}</li>
          </ol>
        </nav>

        <header className="mb-10 flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl flex-shrink-0">
            {author.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{author.name}</h1>
            {author.bio && <p className="mt-2 text-gray-600">{author.bio}</p>}
            <p className="mt-1 text-sm text-gray-500">{author.postCount} articles published</p>
          </div>
        </header>

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
