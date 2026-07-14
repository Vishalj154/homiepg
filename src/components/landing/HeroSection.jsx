import { useState } from 'react'

const CITIES = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Noida', 'Gurgaon']
const BUDGETS = ['₹3,000 – ₹5,000', '₹5,000 – ₹8,000', '₹8,000 – ₹12,000', '₹12,000 – ₹18,000', '₹18,000+']
const GENDERS = ['Male', 'Female', 'Unisex']

const QUICK_TAGS = [
  { label: 'Girls PG', icon: '👩' },
  { label: 'Boys PG', icon: '👨' },
  { label: 'Working Professionals', icon: '💼' },
  { label: 'Students', icon: '🎓' },
  { label: 'With Food', icon: '🍽️' },
  { label: 'Near Metro', icon: '🚇' },
  { label: 'AC Rooms', icon: '❄️' },
  { label: 'WiFi', icon: '📶' },
]

export default function HeroSection() {
  const [activeTag, setActiveTag] = useState(null)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1e1b4b 40%, #0F172A 100%)' }}
      aria-label="Hero section"
    >
      {/* Floating gradient blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-homie-blue/20 blur-[120px] animate-pulse-soft pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-homie-green/15 blur-[100px] animate-pulse-soft pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] right-[15%] w-[300px] h-[300px] rounded-full bg-homie-purple/10 blur-[80px] animate-pulse-soft pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Floating decorative shapes */}
      <div className="absolute top-[15%] left-[8%] w-16 h-16 rounded-2xl border border-white/[0.06] bg-white/[0.03] rotate-12 animate-float pointer-events-none hidden lg:block" />
      <div className="absolute top-[25%] right-[10%] w-12 h-12 rounded-full border border-white/[0.06] bg-white/[0.03] animate-float-slow pointer-events-none hidden lg:block" />
      <div className="absolute bottom-[20%] left-[12%] w-20 h-20 rounded-3xl border border-white/[0.04] bg-white/[0.02] -rotate-6 animate-float-delayed pointer-events-none hidden lg:block" />
      <div className="absolute bottom-[30%] right-[8%] w-10 h-10 rounded-lg border border-homie-blue/10 bg-homie-blue/5 rotate-45 animate-float pointer-events-none hidden lg:block" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-sm mb-8 animate-fade-down">
          <span className="w-2 h-2 rounded-full bg-homie-green animate-pulse" />
          <span className="text-xs font-medium text-white/70 tracking-wide">India's #1 Smart PG Platform</span>
        </div>

        {/* Headline */}
        <h1 className="font-poppins text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-up">
          Find Your Homie.
          <br />
          <span className="gradient-text-blue">Find Your Stay.</span>
        </h1>

        {/* Sub-heading */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '150ms' }}>
          Discover verified PG accommodations with real-time availability,
          transparent pricing, trusted owners, and a seamless booking experience.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-up" style={{ animationDelay: '250ms' }}>
          <a
            href="#search"
            className="group inline-flex items-center gap-2 bg-homie-blue text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-homie-blue/30 hover:shadow-xl hover:shadow-homie-blue/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 btn-ripple"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Find PG
          </a>
          <a
            href="#for-owners"
            className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold px-8 py-3.5 rounded-xl border border-white/[0.15] hover:border-white/25 transition-all duration-300 backdrop-blur-sm"
          >
            List Your PG
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>

        {/* Search Component */}
        <div id="search" className="w-full max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="glass rounded-2xl p-3 sm:p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {/* City */}
              <div className="col-span-1">
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1 block px-1">City</label>
                <select className="w-full bg-white/[0.07] text-white text-sm border-0 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-homie-blue/40 appearance-none cursor-pointer transition-all hover:bg-white/[0.1]" aria-label="Select city">
                  <option value="" className="text-gray-900">All Cities</option>
                  {CITIES.map(c => <option key={c} className="text-gray-900">{c}</option>)}
                </select>
              </div>
              {/* Area */}
              <div className="col-span-1">
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1 block px-1">Area</label>
                <input
                  type="text"
                  placeholder="e.g. Koramangala"
                  className="w-full bg-white/[0.07] text-white text-sm border-0 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-homie-blue/40 placeholder-white/30 transition-all hover:bg-white/[0.1]"
                  aria-label="Enter area"
                />
              </div>
              {/* College / Company */}
              <div className="col-span-1">
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1 block px-1">Near</label>
                <input
                  type="text"
                  placeholder="College / Metro"
                  className="w-full bg-white/[0.07] text-white text-sm border-0 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-homie-blue/40 placeholder-white/30 transition-all hover:bg-white/[0.1]"
                  aria-label="Near college or metro"
                />
              </div>
              {/* Budget */}
              <div className="col-span-1">
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1 block px-1">Budget</label>
                <select className="w-full bg-white/[0.07] text-white text-sm border-0 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-homie-blue/40 appearance-none cursor-pointer transition-all hover:bg-white/[0.1]" aria-label="Select budget">
                  <option value="" className="text-gray-900">Any</option>
                  {BUDGETS.map(b => <option key={b} className="text-gray-900">{b}</option>)}
                </select>
              </div>
              {/* Gender */}
              <div className="col-span-1">
                <label className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1 block px-1">Gender</label>
                <select className="w-full bg-white/[0.07] text-white text-sm border-0 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-homie-blue/40 appearance-none cursor-pointer transition-all hover:bg-white/[0.1]" aria-label="Select gender">
                  <option value="" className="text-gray-900">Any</option>
                  {GENDERS.map(g => <option key={g} className="text-gray-900">{g}</option>)}
                </select>
              </div>
              {/* Search Button */}
              <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex items-end">
                <button className="w-full bg-homie-blue hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-homie-blue/20 hover:shadow-homie-blue/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer btn-ripple text-sm mt-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => setActiveTag(activeTag === tag.label ? null : tag.label)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activeTag === tag.label
                    ? 'bg-homie-blue text-white shadow-md shadow-homie-blue/20'
                    : 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1] hover:text-white/80 border border-white/[0.06]'
                }`}
              >
                <span>{tag.icon}</span>
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-homie-bg to-transparent pointer-events-none" />
    </section>
  )
}
