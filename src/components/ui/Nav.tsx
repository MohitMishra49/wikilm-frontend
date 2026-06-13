import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'Model', href: '#model' },
  { label: 'Playground', href: '#playground' },
  { label: 'Performance', href: '#performance' },
  { label: 'About', href: '#about' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-canvas/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo wordmark */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded bg-sage/20 border border-sage/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-sage" />
          </div>
          <span className="font-sans font-medium text-ink text-sm tracking-wide">
            WikiLM
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-ink-muted hover:text-ink transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            GitHub ↗
          </a>
          <a
            href="#playground"
            className="text-sm bg-sage text-canvas font-medium px-4 py-2 rounded-md hover:bg-sage-light transition-colors duration-200"
          >
            Try it
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-ink-muted hover:text-ink"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-px bg-current transition-all ${mobileOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`} />
            <span className={`block h-px bg-current transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-current transition-all ${mobileOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-canvas border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#playground"
                onClick={() => setMobileOpen(false)}
                className="text-sm bg-sage text-canvas font-medium px-4 py-2 rounded-md text-center"
              >
                Try the playground
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
