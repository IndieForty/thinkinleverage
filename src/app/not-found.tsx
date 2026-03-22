import Link from 'next/link'
import { getAllCategories } from '@/lib/content'

export default function NotFound() {
  const categories = getAllCategories().slice(0, 6)
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">Page not found</h2>
      <p className="text-gray-600 mb-8">The page you are looking for does not exist or has been moved.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
        <Link href="/" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Go home</Link>
        <Link href="/blog" className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Browse articles</Link>
      </div>
      <div className="text-left">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Browse by category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
