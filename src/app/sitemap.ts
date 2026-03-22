import { getAllPosts, getAllPages, getAllCategories, getAllAuthors } from '@/lib/content'
import { siteConfig } from '@/lib/config'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const pages = getAllPages()
  const categories = getAllCategories()
  const authors = getAllAuthors()

  return [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteConfig.url}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...pages.map(p => ({
      url: `${siteConfig.url}/${p.slug === 'index' ? '' : p.slug}`,
      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5,
    })),
    ...categories.map(c => ({
      url: `${siteConfig.url}/category/${c.slug}`,
      lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6,
    })),
    ...authors.map(a => ({
      url: `${siteConfig.url}/author/${a.slug}`,
      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5,
    })),
    ...posts.map(p => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      changeFrequency: 'weekly' as const, priority: 0.7,
    })),
  ]
}
