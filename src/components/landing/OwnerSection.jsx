import { useInView } from '../../hooks/useAnimations'

const OWNER_FEATURES = [
  { title: 'Occupancy Management', desc: 'Track real-time occupancy across all buildings', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { title: 'Room & Bed Management', desc: 'Manage rooms, beds, and floor plans digitally', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z' },
  { title: 'Rent Tracking', desc: 'Automated rent collection with payment history', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { title: 'Tenant KYC', desc: 'Digital document verification and storage', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1' },
  { title: 'Expense Tracking', desc: 'Log all maintenance and operational expenses', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { title: 'Staff Management', desc: 'Track staff attendance, salaries, and roles', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { title: 'Reports & Analytics', desc: 'Revenue reports, occupancy trends, and insights', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { title: 'Booking Requests', desc: 'Receive and manage booking inquiries online', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
]

export default function OwnerSection() {
  const [ref, vis] = useInView()
  return (
    <section id="for-owners" ref={ref} className="py-20 sm:py-28 bg-white overflow-hidden" aria-label="For PG owners">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Content */}
          <div className={`transition-all duration-700 ${vis ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-green bg-homie-green/[0.06] px-4 py-1.5 rounded-full mb-4">For PG Owners</span>
            <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">
              Why PG Owners Love <span className="gradient-text-blue">HomiePG</span>
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Manage your entire PG business from one powerful dashboard. Track occupancy, collect rent, verify tenants, and grow your business — all digitally.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {OWNER_FEATURES.map((f, i) => (
                <div key={f.title} className={`flex gap-3 items-start p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${200 + i * 60}ms` }}>
                  <div className="w-9 h-9 rounded-lg bg-homie-blue/[0.06] flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5 text-homie-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{f.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="bg-homie-blue text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-homie-blue/25 hover:shadow-xl hover:shadow-homie-blue/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer btn-ripple">
              Start Managing Your PG →
            </button>
          </div>

          {/* Right — Dashboard Mockup */}
          <div className={`transition-all duration-700 delay-200 ${vis ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-homie-blue/20 via-homie-green/10 to-homie-purple/20 rounded-3xl blur-2xl opacity-50" />

              {/* Dashboard Card */}
              <div className="relative bg-homie-dark rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                  <span className="w-3 h-3 rounded-full bg-red-400/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <span className="w-3 h-3 rounded-full bg-green-400/80" />
                  <span className="ml-3 text-xs text-white/40 font-mono">HomiePG Dashboard</span>
                </div>

                {/* Dashboard Content */}
                <div className="p-5 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Total Beds', val: '48', color: 'text-homie-blue' },
                      { label: 'Occupied', val: '41', color: 'text-homie-green' },
                      { label: 'Revenue', val: '₹3.2L', color: 'text-homie-purple' },
                    ].map(s => (
                      <div key={s.label} className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">{s.label}</p>
                        <p className={`text-xl font-bold ${s.color} mt-1`}>{s.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Occupancy bars */}
                  <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                    <p className="text-xs text-white/50 mb-3 font-medium">Occupancy Rate</p>
                    {['Building A', 'Building B', 'Building C'].map((b, i) => (
                      <div key={b} className="mb-2.5 last:mb-0">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-white/60">{b}</span>
                          <span className="text-white/40">{[92, 85, 78][i]}%</span>
                        </div>
                        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${vis ? '' : 'w-0'}`} style={{ width: vis ? `${[92, 85, 78][i]}%` : '0%', background: 'linear-gradient(90deg, #1565FF, #22C55E)' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent tenants */}
                  <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                    <p className="text-xs text-white/50 mb-3 font-medium">Recent Tenants</p>
                    {['Priya Sharma', 'Rahul Verma', 'Anjali Patel'].map((n, i) => (
                      <div key={n} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${['bg-homie-blue', 'bg-homie-green', 'bg-homie-purple'][i]}`}>
                          {n.split(' ').map(w => w[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-white/80 font-medium">{n}</p>
                          <p className="text-[10px] text-white/30">Room {['201', '305', '102'][i]}</p>
                        </div>
                        <span className="text-[10px] text-homie-green font-medium">Verified</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
