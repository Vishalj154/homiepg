import { useInView } from '../../hooks/useAnimations'

export default function MobileApp() {
  const [ref, vis] = useInView()
  return (
    <section id="mobile-app" ref={ref} className="py-20 sm:py-28 bg-homie-bg overflow-hidden" aria-label="Mobile app">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <div className={`transition-all duration-700 ${vis ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-green bg-homie-green/[0.06] px-4 py-1.5 rounded-full mb-4">Mobile App</span>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">HomiePG in Your Pocket</h2>
            <p className="text-gray-500 leading-relaxed mb-8">Search PGs, manage your stay, track rent, and receive notifications — all from our native mobile app. Available soon on Android and iOS.</p>

            <div className="space-y-4 mb-8">
              {[
                { icon: '📱', title: 'Android App', status: 'Coming Soon', color: 'text-homie-green' },
                { icon: '🍎', title: 'iOS App', status: 'Coming Soon', color: 'text-homie-blue' },
                { icon: '🌐', title: 'Progressive Web App', status: 'Available Now', color: 'text-homie-purple' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                  </div>
                  <span className={`text-xs font-semibold ${item.color} bg-gray-50 px-3 py-1 rounded-full`}>{item.status}</span>
                </div>
              ))}
            </div>

            {/* QR Placeholder */}
            <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm14 3h.01M17 14h.01M14 17h.01M14 14h3v3h-3v-3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Scan to Download</p>
                <p className="text-xs text-gray-400">QR code will be available when the app launches</p>
              </div>
            </div>
          </div>

          {/* Right — Phone Mockups */}
          <div className={`relative flex justify-center transition-all duration-700 delay-200 ${vis ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="absolute -inset-8 bg-gradient-to-br from-homie-blue/10 via-homie-green/5 to-homie-purple/10 rounded-full blur-3xl" />

            {/* Phone 1 — Tenant */}
            <div className="relative z-10 w-[220px] sm:w-[240px]">
              <div className="bg-homie-dark rounded-[32px] p-2 shadow-2xl border border-white/10">
                <div className="bg-gradient-to-b from-[#1e293b] to-homie-dark rounded-[24px] overflow-hidden">
                  {/* Notch */}
                  <div className="flex justify-center pt-2 pb-3"><div className="w-20 h-5 bg-black rounded-full" /></div>
                  {/* Screen Content */}
                  <div className="px-4 pb-6 space-y-3">
                    <div className="text-center mb-4">
                      <p className="text-[10px] text-white/40">Good Morning 👋</p>
                      <p className="text-sm font-semibold text-white">Find Your PG</p>
                    </div>
                    <div className="bg-white/[0.06] rounded-xl p-3 border border-white/[0.06]">
                      <div className="flex gap-2 items-center">
                        <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <span className="text-xs text-white/30">Search by city or area...</span>
                      </div>
                    </div>
                    {[1, 2].map(n => (
                      <div key={n} className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.05]">
                        <div className={`h-16 rounded-lg bg-gradient-to-r ${n === 1 ? 'from-blue-500 to-indigo-500' : 'from-emerald-500 to-teal-500'} mb-2`} />
                        <div className="h-2 w-3/4 bg-white/10 rounded" />
                        <div className="h-2 w-1/2 bg-white/[0.06] rounded mt-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-center text-xs font-medium text-gray-500 mt-4">Tenant App</p>
            </div>

            {/* Phone 2 — Owner */}
            <div className="relative -ml-8 mt-12 z-20 w-[220px] sm:w-[240px]">
              <div className="bg-homie-dark rounded-[32px] p-2 shadow-2xl border border-white/10">
                <div className="bg-gradient-to-b from-[#1e293b] to-homie-dark rounded-[24px] overflow-hidden">
                  <div className="flex justify-center pt-2 pb-3"><div className="w-20 h-5 bg-black rounded-full" /></div>
                  <div className="px-4 pb-6 space-y-3">
                    <div className="text-center mb-4">
                      <p className="text-[10px] text-white/40">Owner Dashboard</p>
                      <p className="text-sm font-semibold text-white">Your Buildings</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ l: 'Beds', v: '48', c: 'text-homie-blue' }, { l: 'Occupied', v: '41', c: 'text-homie-green' }].map(s => (
                        <div key={s.l} className="bg-white/[0.04] rounded-xl p-2.5 text-center border border-white/[0.05]">
                          <p className={`text-base font-bold ${s.c}`}>{s.v}</p>
                          <p className="text-[9px] text-white/30">{s.l}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.05]">
                      <p className="text-[10px] text-white/40 mb-2">Revenue</p>
                      <div className="flex items-end gap-1 h-12">
                        {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-homie-blue to-homie-green rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs font-medium text-gray-500 mt-4">Owner App</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
