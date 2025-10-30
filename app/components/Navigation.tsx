'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-black border-b border-accent-gray/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl">👻</div>
            <span className="text-xl font-bold text-foreground group-hover:text-accent-orange transition-colors">
              WraithWatchers
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-accent-orange text-black'
                  : 'text-foreground hover:bg-accent-gray/20'
              }`}
            >
              Sightings Map
            </Link>
            <Link
              href="/post"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/post'
                  ? 'bg-accent-orange text-black'
                  : 'text-foreground hover:bg-accent-gray/20'
              }`}
            >
              Post a Sighting
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-foreground hover:bg-accent-gray/20 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-accent-orange text-black'
                  : 'text-foreground hover:bg-accent-gray/20'
              }`}
            >
              Sightings Map
            </Link>
            <Link
              href="/post"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/post'
                  ? 'bg-accent-orange text-black'
                  : 'text-foreground hover:bg-accent-gray/20'
              }`}
            >
              Post a Sighting
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

