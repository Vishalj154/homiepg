import { useInView } from '../../hooks/useAnimations'

const STEPS = [
  { num: '01', title: 'Search', desc: 'Find PGs based on location, budget, gender preference, and amenities.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', color: 'from-homie-blue to-blue-600' },
  { num: '02', title: 'Compare', desc: 'Compare rent, facilities, ratings, and real-time bed availability side by side.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'from-homie-green to-emerald-600' },
  { num: '03', title: 'Contact Owner', desc: 'Talk directly with verified PG owners — no middlemen, no brokers.', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', color: 'from-homie-purple to-violet-600' },
  { num: '04', title: 'Move In', desc: 'Complete your booking online and move in with confidence. No surprises.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'from-amber-500 to-orange-500' },
]

export default function HowItWorks() {
  const [ref, vis] = useInView()
  return (
    <section ref={ref} className="py-20 sm:py-28 bg-white" aria-label="How it works">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-blue bg-homie-blue/[0.06] px-4 py-1.5 rounded-full mb-4">Simple Process</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Finding your perfect PG is as easy as 1-2-3-4. No brokers, no hassle.</p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:grid grid-cols-4 gap-0 relative">
          {/* Connecting Line */}
          <div className={`absolute top-[44px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-homie-blue via-homie-green to-homie-purple transition-all duration-1000 ${vis ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transformOrigin: 'left' }} />

          {STEPS.map((s, i) => (
            <div key={s.num} className={`flex flex-col items-center text-center px-4 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 150}ms` }}>
              <div className={`relative z-10 w-[88px] h-[88px] rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg mb-6`}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs font-bold text-homie-dark shadow-md border border-gray-100">{s.num}</span>
              </div>
              <h3 className="font-poppins font-semibold text-lg text-homie-dark mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden flex flex-col gap-8">
          {STEPS.map((s, i) => (
            <div key={s.num} className={`flex gap-5 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md shrink-0`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                </div>
                {i < STEPS.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-3" />}
              </div>
              <div className="pb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step {s.num}</span>
                <h3 className="font-semibold text-homie-dark text-lg mt-0.5 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
