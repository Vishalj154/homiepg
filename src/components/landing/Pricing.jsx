import { useState } from 'react'
import { useInView } from '../../hooks/useAnimations'

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect for trying out the platform with a single property.',
    highlight: false,
    features: ['1 Building', 'Up to 10 Beds', 'Basic Dashboard', 'Tenant Management', 'Email Support', 'Community Access'],
    cta: 'Get Started Free',
    gradient: 'from-gray-500 to-gray-600',
  },
  {
    name: 'Starter',
    price: '₹999',
    period: '/month',
    desc: 'For small PG owners managing a couple of buildings.',
    highlight: false,
    features: ['Up to 3 Buildings', 'Up to 50 Beds', 'Rent Tracking', 'Expense Management', 'Tenant KYC', 'Priority Email Support', 'Basic Reports'],
    cta: 'Start Free Trial',
    gradient: 'from-homie-blue to-blue-600',
  },
  {
    name: 'Pro',
    price: '₹2,499',
    period: '/month',
    desc: 'For growing PG businesses that need advanced features.',
    highlight: true,
    badge: 'Most Popular',
    features: ['Unlimited Buildings', 'Unlimited Beds', 'Advanced Analytics', 'Staff Management', 'Booking Management', 'Digital Receipts', 'Priority Support', 'Custom Reports', 'API Access'],
    cta: 'Start Free Trial',
    gradient: 'from-homie-blue to-homie-purple',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large-scale PG chains and co-living operators.',
    highlight: false,
    features: ['Everything in Pro', 'Multi-city Support', 'Dedicated Account Manager', 'Custom Integrations', 'SLA Guarantee', 'White-label Option', 'Onboarding Training', 'Phone Support'],
    cta: 'Contact Sales',
    gradient: 'from-homie-green to-emerald-600',
  },
]

export default function Pricing() {
  const [ref, vis] = useInView()
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" ref={ref} className="py-20 sm:py-28 bg-white" aria-label="Pricing plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-10 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-green bg-homie-green/[0.06] px-4 py-1.5 rounded-full mb-4">Pricing</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">Start free and scale as you grow. No hidden fees, no surprises.</p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full p-1">
            <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${!annual ? 'bg-white shadow-sm text-homie-dark' : 'text-gray-500'}`}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${annual ? 'bg-white shadow-sm text-homie-dark' : 'text-gray-500'}`}>
              Yearly <span className="text-homie-green text-xs font-semibold ml-1">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {PLANS.map((p, i) => (
            <div key={p.name} className={`relative rounded-2xl transition-all duration-700 ${p.highlight ? 'lg:-mt-4 lg:mb-4' : ''} ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
              {p.highlight && (
                <div className="absolute -inset-[1px] bg-gradient-to-b from-homie-blue to-homie-purple rounded-2xl" />
              )}
              <div className={`relative bg-white rounded-2xl p-6 border ${p.highlight ? 'border-transparent shadow-xl shadow-homie-blue/10' : 'border-gray-100'} h-full flex flex-col`}>
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-homie-blue to-homie-purple text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md">{p.badge}</span>
                )}
                <h3 className="font-poppins font-semibold text-lg text-homie-dark">{p.name}</h3>
                <div className="mt-3 mb-2">
                  <span className="font-poppins text-3xl font-bold text-homie-dark">
                    {p.price === 'Custom' ? p.price : annual && p.price !== '₹0' ? `₹${Math.round(parseInt(p.price.replace(/[₹,]/g, '')) * 0.8).toLocaleString('en-IN')}` : p.price}
                  </span>
                  {p.period && <span className="text-sm text-gray-400 ml-1">{p.period}</span>}
                </div>
                <p className="text-xs text-gray-500 mb-6">{p.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-homie-green mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${p.highlight ? 'bg-homie-blue text-white shadow-lg shadow-homie-blue/25 hover:shadow-xl hover:-translate-y-0.5' : 'bg-gray-50 text-gray-700 hover:bg-homie-blue/[0.06] hover:text-homie-blue border border-gray-200'}`}>
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
