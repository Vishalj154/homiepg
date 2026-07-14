import { useRef } from 'react'
import { useInView, useCounter } from '../../hooks/useAnimations'

const STATS = [
  { value: 15000, suffix: '+', label: 'Verified Beds', icon: '🛏️' },
  { value: 800, suffix: '+', label: 'Verified PGs', icon: '🏠' },
  { value: 50, suffix: '+', label: 'Cities', icon: '🏙️' },
  { value: 20000, suffix: '+', label: 'Happy Residents', icon: '😊' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction', icon: '⭐' },
]

function StatItem({ stat, isVisible }) {
  const count = useCounter(stat.value, 2200, isVisible)

  return (
    <div className="flex flex-col items-center text-center px-4 py-6">
      <span className="text-2xl mb-2">{stat.icon}</span>
      <span className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark">
        {count.toLocaleString()}{stat.suffix}
      </span>
      <span className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</span>
    </div>
  )
}

export default function TrustSection() {
  const [sectionRef, isVisible] = useInView({ threshold: 0.3 })

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 bg-homie-bg"
      aria-label="Trust statistics"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-black/[0.03] border border-gray-100/80 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-gray-100">
            {STATS.map((stat) => (
              <StatItem key={stat.label} stat={stat} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
