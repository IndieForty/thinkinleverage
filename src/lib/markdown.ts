const SITE_DOMAIN = 'dublinrush.com'

export function markdownToHtml(md: string): string {
  let html = md
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr />')

  // Links — add external link attributes
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
    if (href.includes(SITE_DOMAIN) || href.startsWith('/') || href.startsWith('#')) {
      return `<a href="${href}">${text}</a>`
    }
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
  })

  // Slugify h2 IDs for TOC anchors
  html = html.replace(/<h2 id="([^"]+)">/g, (_m, text) => {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return `<h2 id="${id}">`
  })

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')

  // Paragraphs
  html = html.split('\n\n').map(block => {
    const t = block.trim()
    if (!t) return ''
    if (/^<[a-z]/.test(t)) return t
    return `<p>${t.replace(/\n/g, '<br />')}</p>`
  }).join('\n')

  return html
}

export function extractHeadings(md: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = []
  const regex = /^## (.+)$/gm
  let match
  while ((match = regex.exec(md)) !== null) {
    const text = match[1].replace(/\*\*/g, '').trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    headings.push({ id, text })
  }
  return headings
}
