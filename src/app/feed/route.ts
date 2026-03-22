import { getAllPosts } from '@/lib/content'
import { siteConfig } from '@/lib/config'

export async function GET() {
  const posts = getAllPosts().slice(0, 50)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${esc(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed" rel="self" type="application/rss+xml"/>
${posts.map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${siteConfig.url}/blog/${p.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${p.slug}</guid>
      <description>${esc(p.description)}</description>
      <dc:creator>${esc(p.author)}</dc:creator>
${p.date ? `      <pubDate>${new Date(p.date).toUTCString()}</pubDate>` : ''}
${p.categories.map(c => `      <category>${esc(c)}</category>`).join('\n')}
    </item>`).join('\n')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
