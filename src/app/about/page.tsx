import { getPostBySlug } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: `About ${siteConfig.name} — where tech, finance & strategy collide with a distinctly Irish edge.`,
  alternates: { canonical: `${siteConfig.url}/about` },
}

export default function AboutPage() {
  const page = getPostBySlug('about')
  const bodyHtml = page ? markdownToHtml(page.content) : ''

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-400">About</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">About {siteConfig.name}</h1>

      {page?.featured_image && (
        <img src={page.featured_image} alt={`About ${siteConfig.name}`} className="w-full rounded-lg mb-8" />
      )}

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      <aside className="border-t border-gray-100 mt-12 pt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in touch</h2>
        <p className="text-gray-600 mb-4">
          Want to contribute, advertise, or just say hello? Reach out at{' '}
          <a href="mailto:paul@dublinrush.com" className="text-blue-600 hover:text-blue-800">paul@dublinrush.com</a>
        </p>
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
          Read the latest articles →
        </Link>
      </aside>
    </div>
  )
}
