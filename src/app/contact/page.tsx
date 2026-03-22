import { getPostBySlug } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${siteConfig.name}.`,
  alternates: { canonical: `${siteConfig.url}/contact` },
}

export default function ContactPage() {
  const page = getPostBySlug('contact')
  const bodyHtml = page ? markdownToHtml(page.content) : ''

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-400">Contact</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </div>
  )
}
