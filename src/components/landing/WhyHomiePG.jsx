import { useInView } from '../../hooks/useAnimations'

const FEATURES = [
  { title: 'Verified Listings', desc: 'Every PG is physically verified by our team to ensure quality and safety standards.', color: 'text-homie-blue', bg: 'bg-homie-blue/[0.06]', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Real-Time Availability', desc: 'Check live bed availability before you even visit. No more wasted trips.', color: 'text-homie-green', bg: 'bg-homie-green/[0.06]', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Live Bed Tracking', desc: 'Track exact occupancy status across rooms and floors in real-time.', color: 'text-homie-purple', bg: 'bg-homie-purple/[0.06]', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7' },
  { title: 'Digital KYC', desc: 'Seamless digital verification with Aadhaar and PAN — safe and paperless.', color: 'text-amber-500', bg: 'bg-amber-50', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0' },
  { title: 'Safe & Secure', desc: 'Background-checked owners, CCTV monitoring info, and verified neighborhoods.', color: 'text-rose-500', bg: 'bg-rose-50', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { title: 'Transparent Pricing', desc: 'No hidden charges. What you see on HomiePG is exactly what you pay.', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { title: 'Easy Contact', desc: 'Connect directly with PG owners through verified phone numbers or in-app chat.', color: 'text-sky-500', bg: 'bg-sky-50', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  { title: 'Premium Experience', desc: 'Beautiful interface, smooth interactions, and a booking flow that feels effortless.', color: 'text-violet-500', bg: 'bg-violet-50', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
]

export default function WhyHomiePG() {
  const [ref, vis] = useInView()
  return (
    <section id="why" ref={ref} className="py-20 sm:py-28 bg-homie-bg" aria-label="Why choose HomiePG">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-green bg-homie-green/[0.06] px-4 py-1.5 rounded-full mb-4">Why Choose Us</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">Why HomiePG?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">We are building the most trusted PG ecosystem in India — for tenants and owners alike.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`group bg-white rounded-2xl p-6 border border-gray-100/80 hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-1 transition-all duration-500 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <svg className={`w-6 h-6 ${f.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
