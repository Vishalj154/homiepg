import { useInView } from '../../hooks/useAnimations'

export default function AboutPreview() {
  const [ref, vis] = useInView()
  return (
    <section id="about" ref={ref} className="py-20 sm:py-28 bg-white overflow-hidden" aria-label="About HomiePG">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Visual */}
          <div className={`relative transition-all duration-700 ${vis ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="absolute -inset-6 bg-gradient-to-br from-homie-blue/10 via-homie-green/5 to-homie-purple/10 rounded-3xl blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {[
                { title: 'Our Mission', icon: '🎯', desc: 'To make PG accommodation discovery transparent, safe, and hassle-free for every student and professional in India.', gradient: 'from-homie-blue to-indigo-600' },
                { title: 'Our Vision', icon: '🔭', desc: 'To become India\'s most trusted PG platform — connecting 1 million residents with verified homes by 2028.', gradient: 'from-homie-green to-emerald-600' },
                { title: 'Technology', icon: '⚡', desc: 'Built with React, Supabase, and real-time data pipelines for instant availability updates and seamless performance.', gradient: 'from-homie-purple to-violet-600' },
                { title: 'Security', icon: '🛡️', desc: 'AES-256 encryption, role-based access control, secure KYC storage, and GDPR-compliant data handling.', gradient: 'from-amber-500 to-orange-500' },
              ].map((item, i) => (
                <div key={item.title} className={`bg-homie-dark rounded-2xl p-5 border border-white/[0.06] transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${200 + i * 100}ms` }}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-lg mb-3`}>{item.icon}</div>
                  <h4 className="font-semibold text-white text-sm mb-1.5">{item.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Content */}
          <div className={`transition-all duration-700 delay-200 ${vis ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-blue bg-homie-blue/[0.06] px-4 py-1.5 rounded-full mb-4">About HomiePG</span>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-6">
              Building India's Most <span className="gradient-text-blue">Trusted PG</span> Platform
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              HomiePG was born from a simple frustration — finding a good PG in India shouldn't be this hard. As students and working professionals ourselves, we experienced the pain of broker fees, unverified listings, hidden charges, and zero transparency.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              We're building a platform where tenants can discover verified PGs with real-time availability, and owners can digitize their entire business — from occupancy management to rent collection and compliance. No middlemen, no chaos.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 bg-homie-blue text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-homie-blue/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Learn More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a href="#" className="inline-flex items-center gap-2 text-gray-600 font-medium px-6 py-3 rounded-xl border border-gray-200 hover:border-homie-blue hover:text-homie-blue transition-all duration-300">
                Meet the Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
