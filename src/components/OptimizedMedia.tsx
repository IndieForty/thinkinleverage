/**
 * OptimizedMedia component
 * Handles GIFs from Giphy by serving smaller WebP format
 * Handles local images normally
 * Adds proper loading attributes for LCP optimization
 */

interface OptimizedMediaProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export default function OptimizedMedia({ src, alt, className = '', priority = false }: OptimizedMediaProps) {
  const isGiphy = src.includes('media.giphy.com')

  if (isGiphy) {
    // Use Giphy's downsized WebP — much smaller than raw .gif
    // giphy.gif (~3-5MB) -> 200w.webp (~100-300KB)
    const webpSrc = src.replace('/giphy.gif', '/200w.webp')

    return (
      <img
        src={webpSrc}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' } as any : {})}
      />
    )
  }

  // For local images (including local GIFs)
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchPriority: 'high' } as any : {})}
    />
  )
}
