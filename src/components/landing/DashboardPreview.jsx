import { useInView } from '../../hooks/useAnimations'

const DASHBOARDS = [
  {
    title: 'Owner Dashboard',
    desc: 'Complete command center for managing buildings, tenants, and finances.',
    gradient: 'from-homie-blue to-indigo-600',
    stats: [
      { label: 'Buildings', val: '3', icon: '🏢' },
      { label: 'Beds', val: '48', icon: '🛏️' },
      { label: 'Revenue', val: '₹3.2L', icon: '💰' },
    ],
    bars: [
      { label: 'Occupancy', pct: 92 },
      { label: 'Collection', pct: 87 },
      { label: 'Satisfaction', pct: 95 },
    ],
  },
  {
    title: 'Tenant Dashboard',
    desc: 'Track rent, raise complaints, view documents, and manage your stay.',
    gradient: 'from-homie-green to-emerald-600',
    stats: [
      { label: 'Due', val: '₹0', icon: '✅' },
      { label: 'Stay', val: '8 mo', icon: '📅' },
      { label: 'Room', val: '201', icon: '🚪' },
    ],
    bars: [
      { label: 'Rent Paid', pct: 100 },
      { label: 'KYC Status', pct: 100 },
      { label: 'Complaints', pct: 15 },
    ],
  },
  {
    title: 'Admin Dashboard',
    desc: 'Platform-wide analytics, user management, and system monitoring.',
    gradient: 'from-homie-purple to-violet-600',
    stats: [
      { label: 'Users', val: '2.4K', icon: '👥' },
      { label: 'PGs', val: '812', icon: '🏠' },
      { label: 'Cities', val: '52', icon: '🌍' },
    ],
    bars: [
      { label: 'Uptime', pct: 99 },
      { label: 'Verified', pct: 94 },
      { label: 'Active', pct: 88 },
    ],
  },
]

export default function DashboardPreview() {
  const [ref, vis] = useInView()
  return (
    <section id="dashboards" ref={ref} className="py-20 sm:py-28 bg-white" aria-label="Dashboard previews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-blue bg-homie-blue/[0.06] px-4 py-1.5 rounded-full mb-4">Dashboard Previews</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">Powerful Dashboards for Everyone</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Role-specific dashboards designed for owners, tenants, and platform administrators.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DASHBOARDS.map((d, i) => (
            <div key={d.title} className={`group relative rounded-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 120}ms` }}>
              {/* Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-br ${d.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
              <div className="relative bg-homie-dark rounded-2xl border border-white/[0.06] overflow-hidden">
                {/* Header bar */}
                <div className={`h-1.5 bg-gradient-to-r ${d.gradient}`} />
                <div className="p-5">
                  <h3 className="font-poppins font-semibold text-white text-lg mb-1">{d.title}</h3>
                  <p className="text-xs text-white/40 mb-5">{d.desc}</p>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {d.stats.map(s => (
                      <div key={s.label} className="bg-white/[0.04] rounded-xl p-3 text-center border border-white/[0.05]">
                        <span className="text-lg block mb-1">{s.icon}</span>
                        <p className="text-base font-bold text-white">{s.val}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Bars */}
                  {d.bars.map(b => (
                    <div key={b.label} className="mb-3 last:mb-0">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-white/50">{b.label}</span>
                        <span className="text-white/30">{b.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${d.gradient} transition-all duration-1000 ease-out`} style={{ width: vis ? `${b.pct}%` : '0%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
