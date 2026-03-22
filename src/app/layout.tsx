import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import { getAllCategories } from '@/lib/content'
import CookieConsent from '@/components/CookieConsent'
import './globals.css'

export const metadata: Metadata = {
  title: { default: `${siteConfig.name} – ${siteConfig.tagline}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: { type: 'website', locale: siteConfig.locale, siteName: siteConfig.name },
  twitter: { card: 'summary_large_image', site: siteConfig.social.twitter },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  alternates: { canonical: siteConfig.url, types: { 'application/rss+xml': `${siteConfig.url}/feed` } },
  other: { 'theme-color': '#ffffff' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = getAllCategories().slice(0, 6)

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    sameAs: [],
  }

  const siteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { '@type': 'Organization', name: siteConfig.name },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang={siteConfig.language}>
      <head>
        <link rel="alternate" type="application/rss+xml" title={siteConfig.name} href="/feed" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              {siteConfig.name}
            </Link>
            <div className="flex gap-5 text-sm text-gray-600">
              <Link href="/blog" className="hover:text-gray-900">Articles</Link>
              {categories.slice(0, 3).map(cat => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} className="hidden sm:block hover:text-gray-900">
                  {cat.name}
                </Link>
              ))}
              <Link href="/about" className="hover:text-gray-900">About</Link>
            </div>
          </nav>
        </header>

        <main>{children}</main>
        <CookieConsent />

        <footer className="border-t border-gray-100 mt-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{siteConfig.name}</h3>
                <p className="text-sm text-gray-600">{siteConfig.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <ul className="space-y-1.5 text-sm">
                  {categories.map(cat => (
                    <li key={cat.slug}>
                      <Link href={`/category/${cat.slug}`} className="text-gray-600 hover:text-blue-600">
                        {cat.name} ({cat.postCount})
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Links</h3>
                <ul className="space-y-1.5 text-sm">
                  <li><Link href="/blog" className="text-gray-600 hover:text-blue-600">All articles</Link></li>
                  <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
                  <li><Link href="/feed" className="text-gray-600 hover:text-blue-600">RSS feed</Link></li>
                  <li><Link href="/sitemap.xml" className="text-gray-600 hover:text-blue-600">Sitemap</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6 text-sm text-gray-500">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
