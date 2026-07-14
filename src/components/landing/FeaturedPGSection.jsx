import { useRef } from 'react'
import { useInView } from '../../hooks/useAnimations'

const PG_LISTINGS = [
  {
    name: 'Stanza Living Koramangala',
    location: 'Koramangala, Bangalore',
    rent: '₹8,500',
    rating: 4.8,
    reviews: 124,
    beds: 12,
    gender: 'Unisex',
    amenities: ['WiFi', 'AC', 'Food', 'Laundry'],
    gradient: 'from-blue-500 to-indigo-600',
    tag: 'Popular',
  },
  {
    name: 'Zolo Stays Hinjewadi',
    location: 'Hinjewadi, Pune',
    rent: '₹6,200',
    rating: 4.6,
    reviews: 89,
    beds: 8,
    gender: 'Male',
    amenities: ['WiFi', 'Food', 'Gym', 'Parking'],
    gradient: 'from-emerald-500 to-teal-600',
    tag: 'Value',
  },
  {
    name: 'CoHo Powai',
    location: 'Powai, Mumbai',
    rent: '₹12,000',
    rating: 4.9,
    reviews: 203,
    beds: 5,
    gender: 'Female',
    amenities: ['WiFi', 'AC', 'Food', 'Security'],
    gradient: 'from-violet-500 to-purple-600',
    tag: 'Premium',
  },
  {
    name: 'Nestaway Gachibowli',
    location: 'Gachibowli, Hyderabad',
    rent: '₹5,800',
    rating: 4.5,
    reviews: 67,
    beds: 15,
    gender: 'Male',
    amenities: ['WiFi', 'Food', 'Laundry', 'Power Backup'],
    gradient: 'from-amber-500 to-orange-600',
    tag: 'Trending',
  },
  {
    name: 'OYO Life Sec-62',
    location: 'Sector 62, Noida',
    rent: '₹7,400',
    rating: 4.7,
    reviews: 156,
    beds: 9,
    gender: 'Unisex',
    amenities: ['WiFi', 'AC', 'Gym', 'Food'],
    gradient: 'from-rose-500 to-pink-600',
    tag: 'Top Rated',
  },
  {
    name: 'Colive OMR',
    location: 'OMR, Chennai',
    rent: '₹6,800',
    rating: 4.4,
    reviews: 45,
    beds: 20,
    gender: 'Female',
    amenities: ['WiFi', 'Food', 'Security', 'Parking'],
    gradient: 'from-cyan-500 to-blue-600',
    tag: 'New',
  },
]

const AMENITY_ICONS = {
  WiFi: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
    </svg>
  ),
  AC: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Food: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  default: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
}

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

export default function FeaturedPGSection() {
  const scrollRef = useRef(null)
  const [sectionRef, isVisible] = useInView()

  const scroll = (dir) => {
    if (!scrollRef.current) return
    const amount = 380
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 bg-homie-bg" aria-label="Featured PG listings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-blue bg-homie-blue/[0.06] px-4 py-1.5 rounded-full mb-4">Featured Listings</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">
            Handpicked PGs Just For You
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Browse our curated selection of top-rated, verified PG accommodations across India's major cities.
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white rounded-full shadow-lg shadow-black/[0.08] items-center justify-center hover:shadow-xl hover:scale-105 transition-all cursor-pointer border border-gray-100"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white rounded-full shadow-lg shadow-black/[0.08] items-center justify-center hover:shadow-xl hover:scale-105 transition-all cursor-pointer border border-gray-100"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Cards */}
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-snap-x pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
            {PG_LISTINGS.map((pg, i) => (
              <article
                key={pg.name}
                className={`flex-shrink-0 w-[320px] sm:w-[340px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100/80 hover:border-gray-200 transition-all duration-500 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Image */}
                <div className={`relative h-48 bg-gradient-to-br ${pg.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-500" />
                  {/* Building illustration */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full px-8">
                    <div className="flex items-end justify-center gap-2 pb-2">
                      <div className="w-12 h-24 bg-white/20 rounded-t-lg" />
                      <div className="w-16 h-32 bg-white/25 rounded-t-lg" />
                      <div className="w-10 h-20 bg-white/15 rounded-t-lg" />
                      <div className="w-14 h-28 bg-white/20 rounded-t-lg" />
                    </div>
                  </div>
                  {/* Tag */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-lg text-gray-800 shadow-sm">
                    {pg.tag}
                  </span>
                  {/* Gender Badge */}
                  <span className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-lg text-white">
                    {pg.gender}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2">{pg.name}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <StarIcon />
                      <span className="text-sm font-semibold text-gray-800">{pg.rating}</span>
                      <span className="text-xs text-gray-400">({pg.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {pg.location}
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pg.amenities.map((a) => (
                      <span key={a} className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-[11px] font-medium px-2 py-1 rounded-md">
                        {AMENITY_ICONS[a] || AMENITY_ICONS.default}
                        {a}
                      </span>
                    ))}
                  </div>

                  {/* Bottom */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div>
                      <span className="text-xl font-bold text-homie-dark">{pg.rent}</span>
                      <span className="text-xs text-gray-400 ml-1">/month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-homie-green font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-homie-green animate-pulse" />
                        {pg.beds} beds
                      </span>
                      <button className="bg-homie-blue/[0.08] hover:bg-homie-blue hover:text-white text-homie-blue text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-300 cursor-pointer">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
