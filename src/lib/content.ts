import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  author: string
  authorSlug: string
  featured_image: string
  categories: string[]
  page_type: string
  word_count: number
  reading_time: number
  content: string
}

export interface AuthorInfo {
  name: string
  slug: string
  bio: string
  postCount: number
}

export interface CategoryInfo {
  name: string
  slug: string
  postCount: number
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function cleanTitle(title: string): string {
  return title.replace(/ - DublinRush.*$/i, '').replace(/ \| DublinRush.*$/i, '').trim()
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const filePath = path.join(contentDir, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    const wordCount = data.word_count || content.split(/\s+/).length
    const author = data.author || 'DublinRush'
    return {
      slug,
      title: cleanTitle(data.title || slug),
      description: data.description || '',
      date: data.date || '',
      author,
      authorSlug: slugify(author),
      featured_image: data.featured_image || '',
      categories: (data.categories || []).filter((c: string) => c && c !== 'Uncategorized'),
      page_type: data.page_type || 'post',
      word_count: wordCount,
      reading_time: Math.max(1, Math.ceil(wordCount / 238)),
      content,
    }
  } catch { return null }
}

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'))
  return files.map(f => getPostBySlug(f.replace('.mdx', '')))
    .filter((p): p is Post => p !== null && p.page_type === 'post' && p.word_count > 100)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllPages(): Post[] {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'))
  return files.map(f => getPostBySlug(f.replace('.mdx', '')))
    .filter((p): p is Post => p !== null && p.page_type === 'page')
}

export function getAllSlugs(): string[] {
  return fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx')).map(f => f.replace('.mdx', ''))
}

export function getRelatedPosts(post: Post, limit = 4): Post[] {
  const all = getAllPosts()
  return all
    .filter(p => p.slug !== post.slug)
    .map(p => ({ post: p, score: p.categories.filter(c => post.categories.includes(c)).length }))
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, limit)
    .map(p => p.post)
}

export function getAllCategories(): CategoryInfo[] {
  const posts = getAllPosts()
  const catMap = new Map<string, number>()
  posts.forEach(p => p.categories.forEach(c => catMap.set(c, (catMap.get(c) || 0) + 1)))
  return Array.from(catMap.entries())
    .map(([name, postCount]) => ({ name, slug: slugify(name), postCount }))
    .sort((a, b) => b.postCount - a.postCount)
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter(p => p.categories.some(c => slugify(c) === categorySlug))
}

export function getAllAuthors(): AuthorInfo[] {
  const posts = getAllPosts()
  const authorMap = new Map<string, number>()
  posts.forEach(p => { if (p.author) authorMap.set(p.author, (authorMap.get(p.author) || 0) + 1) })
  return Array.from(authorMap.entries())
    .map(([name, postCount]) => ({
      name, slug: slugify(name), postCount,
      bio: name === 'Paul Allen' ? 'Founder of DublinRush. Writing about B2B growth, marketing strategy, and Ireland\'s digital economy.' : '',
    }))
    .sort((a, b) => b.postCount - a.postCount)
}

export function getPostsByAuthor(authorSlug: string): Post[] {
  return getAllPosts().filter(p => p.authorSlug === authorSlug)
}
