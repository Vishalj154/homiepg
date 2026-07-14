import { useState } from 'react'
import { useInView } from '../../hooks/useAnimations'

const FAQS = [
  { q: 'What is HomiePG?', a: 'HomiePG is India\'s smart PG discovery and management platform. Tenants can search, compare, and book verified PG accommodations, while owners can manage their entire PG business digitally — from occupancy and rent tracking to tenant KYC and expense management.' },
  { q: 'Is HomiePG free to use for tenants?', a: 'Yes! Searching, comparing, and contacting PG owners is completely free for tenants. There are no broker fees or hidden charges. You only pay the rent directly to the PG owner.' },
  { q: 'How does the real-time availability feature work?', a: 'PG owners update their bed availability through our dashboard. This data is reflected instantly on the tenant-facing search results, so you always see accurate, up-to-date availability before visiting.' },
  { q: 'Are the PG listings on HomiePG verified?', a: 'Yes. Our team physically verifies each PG before listing it on the platform. We check amenities, safety standards, cleanliness, and owner credentials to ensure quality.' },
  { q: 'How do I list my PG on HomiePG?', a: 'Sign up as a PG owner, add your building details, rooms, beds, amenities, and photos. Once our team verifies your property, it goes live on the platform. The basic listing is free.' },
  { q: 'What documents are needed for tenant KYC?', a: 'Tenants typically need to upload a government-issued ID (Aadhaar card, PAN card, or passport) and a recent photograph. All documents are stored securely and encrypted.' },
  { q: 'Can I manage multiple PG buildings?', a: 'Absolutely! Our Starter, Pro, and Enterprise plans support multiple buildings. You can manage all your properties from a single dashboard with building-level analytics.' },
  { q: 'Is my data safe on HomiePG?', a: 'Yes. We use industry-standard encryption (AES-256) for data at rest and TLS for data in transit. All KYC documents are stored in encrypted cloud storage with strict access controls.' },
  { q: 'Do you offer a mobile app?', a: 'We are currently developing native Android and iOS apps for both tenants and owners. The web app is fully responsive and works great on mobile browsers in the meantime.' },
  { q: 'What payment methods do tenants use?', a: 'Rent payments are currently handled directly between tenants and owners. We are working on integrated payment support with UPI, net banking, and card payments — coming soon.' },
  { q: 'Can PG owners track expenses and generate reports?', a: 'Yes! Owners can log all expenses (maintenance, utilities, staff salaries), categorize them, and generate monthly or yearly P&L reports with one click.' },
  { q: 'How do I contact HomiePG support?', a: 'You can reach us via email at support@homiepg.com, through our in-app chat, or via WhatsApp. Pro and Enterprise customers get priority support with faster response times.' },
]

function FAQItem({ faq, isOpen, toggle }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={toggle} className="w-full flex items-center justify-between py-5 px-1 text-left cursor-pointer group" aria-expanded={isOpen}>
        <span className="font-medium text-gray-800 text-sm sm:text-base pr-4 group-hover:text-homie-blue transition-colors">{faq.q}</span>
        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-homie-blue text-white rotate-45' : 'bg-gray-100 text-gray-500 group-hover:bg-homie-blue/[0.08]'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
        </span>
      </button>
      <div className={`faq-content ${isOpen ? 'open' : ''}`}>
        <p className="text-sm text-gray-500 leading-relaxed pb-5 px-1">{faq.a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [ref, vis] = useInView()
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-homie-bg" aria-label="Frequently asked questions">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-homie-blue bg-homie-blue/[0.06] px-4 py-1.5 rounded-full mb-4">FAQ</span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-homie-dark mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Everything you need to know about HomiePG. Can't find your answer? Contact our support team.</p>
        </div>
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm px-6 sm:px-8 transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '150ms' }}>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} isOpen={openIdx === i} toggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
