'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-700 font-medium">We use cookies</p>
          <p className="text-xs text-gray-500 mt-1">
            This site uses cookies to improve your experience. By continuing to browse, you agree to our use of cookies.
            See our <Link href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</Link> for details.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={reject}
            className="text-xs px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={accept}
            className="text-xs px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
