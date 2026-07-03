import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/logo.png'

const FEATURES = [
  {
    icon: '🛏️',
    title: 'Real-time Bed Availability',
    desc: 'See every bed across all your buildings — occupied or vacant — in a single dashboard view.',
  },
  {
    icon: '📋',
    title: 'Digital KYC & Documents',
    desc: 'Upload, store, and verify Aadhaar, PAN, and other tenant documents securely.',
  },
  {
    icon: '🍽️',
    title: 'Amenity Tracking',
    desc: 'Log food type, WiFi, water timings, parking, laundry, and power backup per building.',
  },
  {
    icon: '💸',
    title: 'Rent Collection with Receipts',
    desc: 'Mark monthly payments as paid, upload receipt photos, and track dues automatically.',
  },
  {
    icon: '📊',
    title: 'Expense Tracking',
    desc: 'Record maintenance costs, utility bills, and repairs — with bill photo uploads.',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [toast, setToast] = useState(false)

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg animate-pulse">
          🔍 Tenant search is coming soon!
        </div>
      )}

      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center text-center px-6 py-28 relative overflow-hidden"
        style={{ background: '#0F172A' }}
      >
        {/* Subtle glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-homie-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-homie-green/15 rounded-full blur-3xl pointer-events-none" />

        <img src={logo} alt="HomiePG" className="h-20 w-auto mb-8 drop-shadow-2xl relative z-10" />

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight relative z-10">
          Find Your Homie.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-homie-blue to-homie-green">
            Find Your Stay.
          </span>
        </h1>

        <p className="text-slate-400 text-lg max-w-lg mb-10 relative z-10">
          The all-in-one dashboard for PG owners to manage buildings, tenants,
          rent, and documents — without the chaos.
        </p>

        {/* Search bar mockup */}
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col sm:flex-row gap-2 mb-8 relative z-10">
          <select className="flex-1 bg-white/10 text-white border-0 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/50 appearance-none cursor-pointer">
            <option value="" className="text-gray-900">🏙️ City</option>
            <option className="text-gray-900">Bangalore</option>
            <option className="text-gray-900">Mumbai</option>
            <option className="text-gray-900">Delhi</option>
            <option className="text-gray-900">Pune</option>
            <option className="text-gray-900">Hyderabad</option>
          </select>
          <select className="flex-1 bg-white/10 text-white border-0 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/50 appearance-none cursor-pointer">
            <option value="" className="text-gray-900">🛏️ Room Type</option>
            <option className="text-gray-900">Single</option>
            <option className="text-gray-900">Double Sharing</option>
            <option className="text-gray-900">Triple Sharing</option>
          </select>
          <select className="flex-1 bg-white/10 text-white border-0 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/50 appearance-none cursor-pointer">
            <option value="" className="text-gray-900">🏠 Category</option>
            <option className="text-gray-900">Co-living</option>
            <option className="text-gray-900">Male Only</option>
            <option className="text-gray-900">Female Only</option>
          </select>
          <button
            onClick={showToast}
            className="bg-homie-blue hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all whitespace-nowrap"
          >
            Search
          </button>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center relative z-10">
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-homie-blue font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Owner Login →
          </button>
          <button
            onClick={showToast}
            className="bg-transparent text-white font-semibold px-8 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition-all"
          >
            Find a PG
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
            Built for PG owners, end to end
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Every feature is wired to real data — no fake dashboards, no placeholder numbers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="HomiePG" className="h-8 w-auto" />
            <span className="text-sm text-gray-400">Find Your Homie. Find Your Stay.</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} HomiePG. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}
