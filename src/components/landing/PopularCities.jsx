import { useInView } from '../../hooks/useAnimations'

const CITIES = [
  { name: 'Bangalore', pgs: '280+ PGs', gradient: 'from-blue-500 via-indigo-500 to-violet-600', emoji: '🏙️' },
  { name: 'Hyderabad', pgs: '150+ PGs', gradient: 'from-emerald-500 via-teal-500 to-cyan-600', emoji: '🕌' },
  { name: 'Pune', pgs: '210+ PGs', gradient: 'from-orange-400 via-amber-500 to-yellow-500', emoji: '⛰️' },
  { name: 'Mumbai', pgs: '320+ PGs', gradient: 'from-rose-500 via-pink-500 to-fuchsia-600', emoji: '🌊' },
  { name: 'Delhi', pgs: '190+ PGs', gradient: 'from-red-500 via-rose-500 to-pink-500', emoji: '🏛️' },
  { name: 'Chennai', pgs: '120+ PGs', gradient: 'from-violet-500 via-purple-500 to-indigo-600', emoji: '🛕' },
  { name: 'Noida', pgs: '95+ PGs', gradient: 'from-sky-500 via-blue-500 to-indigo-500', emoji: '🏢' },
  { name: 'Gurgaon', pgs: '130+ PGs', gradient: 'from-teal-500 via-emerald-500 to-green-500', emoji: '🌆' },
]

export default function PopularCities() {
  const [ref, vis] = useInView()
  return (
    <section id="cities" ref={ref} className="py-20 sm:py-28 bg-white" aria-label="Popular cities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-purple bg-homie-purple/[0.06] px-4 py-1.5 rounded-full mb-4">Explore Cities</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">Popular Cities</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Find the best verified PG accommodations in India's top cities for students and professionals.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {CITIES.map((c, i) => (
            <a key={c.name} href="#" className={`group relative rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 80}ms` }} aria-label={`Explore PGs in ${c.name}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} transition-transform duration-700 group-hover:scale-110`} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl sm:text-7xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700">{c.emoji}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                <h3 className="font-poppins font-bold text-white text-lg sm:text-xl mb-0.5">{c.name}</h3>
                <p className="text-white/70 text-xs sm:text-sm font-medium">{c.pgs}</p>
                <div className="mt-2 flex items-center gap-1.5 text-white/80 text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
