import { useState, useEffect } from 'react'
import { useInView } from '../../hooks/useAnimations'

const REVIEWS = [
  { name: 'Ananya Sharma', city: 'Bangalore', role: 'Student', rating: 5, review: 'HomiePG made finding a PG so easy! I compared three places near my college, contacted the owner directly, and moved in within two days. The live bed availability feature saved me so many wasted visits.', initials: 'AS', color: 'bg-homie-blue' },
  { name: 'Rajesh Kumar', city: 'Pune', role: 'Working Professional', rating: 5, review: 'As someone who relocated to Pune for work, HomiePG was a lifesaver. Transparent pricing, verified listings, and genuine owner contacts. No broker fees, no surprises. Highly recommended!', initials: 'RK', color: 'bg-homie-green' },
  { name: 'Meera Patel', city: 'Mumbai', role: 'PG Owner', rating: 5, review: 'Managing three PG buildings was chaotic before HomiePG. Now I track occupancy, collect rent digitally, and handle KYC — all from one dashboard. My revenue has increased by 25% in 6 months.', initials: 'MP', color: 'bg-homie-purple' },
  { name: 'Vikram Singh', city: 'Delhi', role: 'Student', rating: 4, review: 'The search filters are amazing — I filtered by budget, gender, and proximity to my metro station. Found a great PG with AC and food included within my budget. The app experience is top-notch.', initials: 'VS', color: 'bg-amber-500' },
  { name: 'Priya Reddy', city: 'Hyderabad', role: 'Working Professional', rating: 5, review: 'What I love most is the transparency. Every listing has real photos, actual rent, and verified amenities. I have recommended HomiePG to all my colleagues who are looking for accommodation.', initials: 'PR', color: 'bg-rose-500' },
  { name: 'Suresh Nair', city: 'Chennai', role: 'PG Owner', rating: 5, review: 'The expense tracking and reports features alone are worth it. I can now see exactly where my money goes, track maintenance costs, and generate monthly P&L reports with one click.', initials: 'SN', color: 'bg-teal-500' },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < count ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [ref, vis] = useInView()
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(3)

  useEffect(() => {
    const update = () => setPerPage(window.innerWidth < 768 ? 1 : 3)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const pages = Math.ceil(REVIEWS.length / perPage)

  return (
    <section id="testimonials" ref={ref} className="py-20 sm:py-28 bg-homie-bg" aria-label="Testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-500 bg-amber-50 px-4 py-1.5 rounded-full mb-4">Testimonials</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">Loved by Thousands</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Hear from students, professionals, and PG owners who trust HomiePG every day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.slice(page * perPage, page * perPage + perPage).map((r, i) => (
            <div key={r.name} className={`bg-white rounded-2xl p-6 border border-gray-100/80 shadow-sm hover:shadow-lg transition-all duration-500 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <Stars count={r.rating} />
              <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-6">"{r.review}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center text-white text-xs font-bold`}>{r.initials}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.role} • {r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${page === i ? 'bg-homie-blue w-8' : 'bg-gray-300 hover:bg-gray-400'}`} aria-label={`Page ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
