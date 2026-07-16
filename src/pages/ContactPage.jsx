import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setStatus('')
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      created_at: new Date().toISOString(),
    })
    setLoading(false)
    if (error) {
      setStatus('Unable to save your message right now. Please email us directly.')
      return
    }
    setStatus('Thanks for reaching out — we will review your message shortly.')
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl bg-slate-900 p-8 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Contact</p>
          <h1 className="mt-3 text-3xl font-semibold">Let’s talk about your PG operations.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-400">Contact us for onboarding, demos, support, or partnership conversations.</p>
          <div className="mt-8 space-y-3 text-sm">
            <p>📍 42 MG Road, Bengaluru, India</p>
            <p>
              ✉️ Contact us through mail:{' '}
              <a href="mailto:hello@homiepg.com" className="text-cyan-400 hover:underline">
                hello@homiepg.com
              </a>
            </p>
            <p>📞 +91 98765 43210</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          </div>
          <textarea className="mt-4 min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <button disabled={loading} type="submit" className="mt-4 rounded-full bg-cyan-600 px-5 py-3 font-medium text-white">{loading ? 'Sending...' : 'Send message'}</button>
          {status && <p className="mt-3 text-sm text-slate-600">{status}</p>}
        </form>
      </div>
    </div>
  )
}
