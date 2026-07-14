import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Find PG', href: '#search' },
  { label: 'Cities', href: '#cities' },
  { label: 'For Owners', href: '#for-owners' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-gray-100/80'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-[72px] lg:h-20">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 relative z-50" aria-label="HomiePG home">
            <img src={logo} alt="HomiePG" className="h-9 lg:h-10 w-auto" loading="eager" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                  scrolled
                    ? 'text-gray-600 hover:text-homie-blue hover:bg-blue-50/60'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={() => navigate('/login')}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                scrolled
                  ? 'text-gray-600 hover:text-homie-blue hover:bg-blue-50/60'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`text-sm font-medium px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                scrolled
                  ? 'border-gray-200 text-gray-700 hover:border-homie-blue hover:text-homie-blue'
                  : 'border-white/25 text-white hover:bg-white/10 hover:border-white/40'
              }`}
            >
              Sign Up
            </button>
            <a href="#for-owners" className="text-sm font-semibold px-5 py-2.5 bg-homie-blue text-white rounded-xl hover:shadow-lg hover:shadow-homie-blue/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer btn-ripple">
              List Your PG
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
              mobileOpen ? 'rotate-45 translate-y-[7px] bg-gray-900' : scrolled ? 'bg-gray-800' : 'bg-white'
            }`} />
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${
              mobileOpen ? 'opacity-0 scale-0' : scrolled ? 'bg-gray-800' : 'bg-white'
            }`} />
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 origin-center ${
              mobileOpen ? '-rotate-45 -translate-y-[7px] bg-gray-900' : scrolled ? 'bg-gray-800' : 'bg-white'
            }`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white z-40 lg:hidden shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-8">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobile}
                className="text-[15px] font-medium text-gray-700 px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-homie-blue transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-gray-100">
            <button
              onClick={() => { navigate('/login'); closeMobile() }}
              className="w-full py-3 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:border-homie-blue hover:text-homie-blue transition-all cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => { navigate('/login'); closeMobile() }}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-homie-blue rounded-xl hover:shadow-lg transition-all cursor-pointer"
            >
              List Your PG
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
