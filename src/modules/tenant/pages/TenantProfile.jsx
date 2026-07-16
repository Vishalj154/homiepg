import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

export default function TenantProfile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    full_name: '', phone: '', city: '', state: '',
    gender: '', date_of_birth: '', emergency_contact: '', address: ''
  })

  useEffect(() => { if (user) fetchProfile() }, [user])

  async function fetchProfile() {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
      setProfile(data)
      setForm({
        full_name: data.full_name || '',
        phone: data.phone || '',
        gender: data.gender || '',
        date_of_birth: data.date_of_birth || '',
        emergency_contact: data.emergency_contact || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
      })
    }
    setLoading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name, phone: form.phone,
      gender: form.gender, date_of_birth: form.date_of_birth,
      emergency_contact: form.emergency_contact, address: form.address,
      city: form.city, state: form.state,
    }).eq('id', user.id)

    if (error) {
      console.error("Error saving profile", error)
      await supabase.from('profiles').update({ full_name: form.full_name }).eq('id', user.id)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    fetchProfile()
    setSaving(false)
  }

  async function handleSignOut() {
    navigate('/')
    await signOut()
  }

  const initials = (form.full_name || user?.email || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      <div className="px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-100 mb-1">My Profile</h1>
        <p className="text-gray-400 text-sm mb-8">Manage your personal and contact details.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="bg-slate-900 rounded-2xl border border-white/5 p-6 flex flex-col items-center text-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-cyan-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg select-none">
                {initials}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <span className="text-white text-xs font-medium">Change Photo</span>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-100">{form.full_name || '—'}</p>
              <p className="text-sm text-cyan-400 mt-0.5">Verified Tenant</p>
            </div>
            <div className="w-full border-t border-white/10 pt-4 space-y-2 text-left">
              <div className="flex gap-2 text-sm">
                <span className="text-slate-400 w-14 shrink-0">Email</span>
                <span className="text-slate-200 text-xs truncate">{user?.email}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-slate-400 w-14 shrink-0">Joined</span>
                <span className="text-slate-200 text-xs">{joinedDate}</span>
              </div>
              {(form.city || form.state) && (
                <div className="flex gap-2 text-sm">
                  <span className="text-slate-400 w-14 shrink-0">Location</span>
                  <span className="text-slate-200 text-xs">{[form.city, form.state].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 rounded-2xl border border-white/5 p-6">
              <h2 className="font-semibold text-gray-100 mb-4">Personal Information</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                    <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Phone</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Gender</label>
                    <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                      className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-cyan-500">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Date of Birth</label>
                    <input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })}
                      className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Emergency Contact</label>
                  <input value={form.emergency_contact} onChange={e => setForm({ ...form, emergency_contact: e.target.value })}
                    placeholder="Name & Phone"
                    className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Permanent Address</label>
                  <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Street address"
                    className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">City</label>
                    <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="City"
                      className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">State</label>
                    <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                      placeholder="State"
                      className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm bg-slate-950 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button type="submit" disabled={saving}
                    className="bg-cyan-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-cyan-500 transition-all">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                  {saved && <span className="text-cyan-400 text-sm font-medium">✅ Profile Updated!</span>}
                </div>
              </form>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-red-900/50 p-6">
              <h2 className="font-semibold text-gray-100 mb-1">Sign Out</h2>
              <p className="text-sm text-slate-400 mb-4">Securely sign out of your account.</p>
              <button onClick={handleSignOut}
                className="border border-red-900/50 text-red-400 px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-950 transition-all">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
