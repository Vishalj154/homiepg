import { useInView } from '../../hooks/useAnimations'

export default function ContactCTA() {
  const [ref, vis] = useInView()
  return (
    <section id="contact" ref={ref} className="py-20 sm:py-28 bg-homie-bg" aria-label="Contact CTA">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${vis ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'}`}>
          {/* BG */}
          <div className="absolute inset-0 bg-gradient-to-br from-homie-dark via-[#1a1a4e] to-homie-dark" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-homie-blue/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-homie-purple/15 rounded-full blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 text-center px-6 sm:px-12 py-16 sm:py-20">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.05] mb-6">
              <span className="w-2 h-2 rounded-full bg-homie-green animate-pulse" />
              <span className="text-xs font-medium text-white/60">Ready to get started?</span>
            </span>
            <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to Find Your <br className="hidden sm:block" />
              <span className="gradient-text-blue">Perfect PG?</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-10 text-sm sm:text-base">
              Whether you're a tenant looking for your next home or a PG owner ready to digitize — HomiePG is here for you.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="bg-homie-blue text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-homie-blue/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer btn-ripple text-sm">
                Book a Demo
              </button>
              <button className="bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold px-7 py-3.5 rounded-xl border border-white/[0.15] hover:border-white/25 transition-all duration-300 backdrop-blur-sm cursor-pointer text-sm">
                Contact Sales
              </button>
              <button className="bg-homie-green text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-homie-green/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-sm">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
