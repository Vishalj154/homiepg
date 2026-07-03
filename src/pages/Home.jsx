import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const FEATURES = [
  {
    icon: '🏠',
    title: 'Real-time Vacancy',
    desc: 'See which beds are occupied or vacant across all your buildings in one glance.',
  },
  {
    icon: '📋',
    title: 'KYC & Document Management',
    desc: 'Upload and verify Aadhaar, PAN, and other tenant documents securely.',
  },
  {
    icon: '💸',
    title: 'Rent Collection Tracking',
    desc: 'Mark payments as paid, upload receipts, and never lose track of dues.',
  },
  {
    icon: '📊',
    title: 'Expense Tracking',
    desc: 'Log maintenance costs, utilities, and repairs to stay on top of your books.',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Hero */}
      <section
        className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24"
        style={{
          background: 'linear-gradient(135deg, #3B4DD1 0%, #1FAE7F 100%)',
        }}
      >
        <img src={logo} alt="HomiePG" className="h-20 w-auto mb-6 drop-shadow-lg" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Find Your Homie.<br />Find Your Stay.
        </h1>
        <p className="text-white/80 text-lg max-w-lg mb-10">
          HomiePG is a simple, powerful dashboard for PG owners to manage buildings,
          tenants, rent, and documents — all in one place.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-homie-blue font-semibold px-8 py-3 rounded-xl shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Owner Login
          </button>
          <button
            disabled
            title="Coming soon — tenant-facing search is under development"
            className="bg-white/20 text-white font-semibold px-8 py-3 rounded-xl border border-white/30 cursor-not-allowed opacity-70"
          >
            Find a PG (Coming Soon)
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Everything an owner needs
          </h2>
          <p className="text-gray-500 text-center mb-12 text-sm">
            Built for solo PG owners — no complexity, just the tools you need.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="HomiePG" className="h-8 w-auto" />
            <span className="text-sm text-gray-500">Find Your Homie. Find Your Stay.</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} HomiePG. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}
