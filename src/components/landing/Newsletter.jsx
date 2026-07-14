import { useState } from 'react'
import { useInView } from '../../hooks/useAnimations'

export default function Newsletter() {
  const [ref, vis] = useInView()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | error | success
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address.')
      return
    }
    setStatus('success')
    setEmail('')
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-white" aria-label="Newsletter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className={`text-center transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-block text-2xl mb-3">📬</span>
          <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-homie-dark mb-3">Stay in the Loop</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">Get the latest PG listings, platform updates, tips, and exclusive offers delivered to your inbox.</p>

          {status === 'success' ? (
            <div className="inline-flex items-center gap-2 bg-homie-green/10 text-homie-green font-medium px-6 py-3 rounded-xl animate-fade-up">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              You're subscribed! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
                  placeholder="Enter your email address"
                  className={`w-full px-5 py-3.5 rounded-xl border text-sm transition-all duration-200 outline-none ${
                    status === 'error' ? 'border-red-300 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-homie-blue focus:ring-2 focus:ring-homie-blue/10'
                  }`}
                  aria-label="Email address"
                />
                {status === 'error' && <p className="text-xs text-red-500 mt-1.5 text-left pl-1">{errorMsg}</p>}
              </div>
              <button type="submit" className="bg-homie-blue text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-homie-blue/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer btn-ripple text-sm whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
          <p className="text-xs text-gray-400 mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}
