import { useInView } from '../../hooks/useAnimations'

const FEATURES = [
  { title: 'Bed Management', desc: 'Track every bed across buildings — vacant, occupied, or under maintenance — in real time.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'text-homie-blue', bg: 'bg-homie-blue/[0.06]' },
  { title: 'Booking Management', desc: 'Receive, review, and confirm tenant booking requests digitally with instant notifications.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-homie-green', bg: 'bg-homie-green/[0.06]' },
  { title: 'Analytics & Insights', desc: 'Revenue trends, occupancy rates, expense breakdowns — all visualized beautifully.', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-homie-purple', bg: 'bg-homie-purple/[0.06]' },
  { title: 'Digital Rent Collection', desc: 'Automated rent reminders, payment tracking, receipt generation, and due date alerts.', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', color: 'text-amber-500', bg: 'bg-amber-50' },
  { title: 'Smart Notifications', desc: 'Real-time alerts for payments, bookings, complaints, and occupancy changes.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', color: 'text-rose-500', bg: 'bg-rose-50' },
  { title: 'Employee Management', desc: 'Track staff attendance, assign roles, manage salaries, and monitor performance.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: 'text-sky-500', bg: 'bg-sky-50' },
  { title: 'Reports & Exports', desc: 'Generate monthly P&L reports, tenant lists, rent summaries, and export to PDF.', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-teal-500', bg: 'bg-teal-50' },
  { title: 'KYC Verification', desc: 'Digital Aadhaar and PAN verification with secure document storage and compliance.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { title: 'Smart Search', desc: 'Find PGs by city, area, college, metro station, budget, gender, and amenities.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { title: 'Secure Auth', desc: 'Role-based access control for owners, tenants, and admins with encrypted data.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', color: 'text-orange-500', bg: 'bg-orange-50' },
  { title: 'Owner Dashboard', desc: 'Centralized command center for managing all buildings, finances, and operations.', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', color: 'text-violet-500', bg: 'bg-violet-50' },
  { title: 'Tenant Portal', desc: 'Tenants can view rent history, raise complaints, and access documents online.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'text-pink-500', bg: 'bg-pink-50' },
]

export default function FeaturesGrid() {
  const [ref, vis] = useInView()
  return (
    <section ref={ref} className="py-20 sm:py-28 bg-homie-bg" aria-label="All features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-purple bg-homie-purple/[0.06] px-4 py-1.5 rounded-full mb-4">Platform Features</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">Everything You Need, Built In</h2>
          <p className="text-gray-500 max-w-xl mx-auto">A complete ecosystem for PG discovery and management — no third-party tools needed.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`group bg-white rounded-2xl p-5 border border-gray-100/80 hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-1 transition-all duration-500 cursor-default ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 50}ms` }}>
              <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <svg className={`w-5 h-5 ${f.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
