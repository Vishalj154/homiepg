import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    business_name: '',
    city: '',
    state: '',
  })

  useEffect(() => {
    if (user) fetchProfile()
  }, [user])

  async function fetchProfile() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) {
      setProfile(data)
      setForm({
        full_name: data.full_name || '',
        phone: data.phone || '',
        business_name: data.business_name || data.pg_name || '',
        city: data.city || '',
        state: data.state || '',
      })
    }
    setLoading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        phone: form.phone,
        business_name: form.business_name,
        city: form.city,
        state: form.state,
      })
      .eq('id', user.id)

    if (error) {
      // Fallback: just update full_name if extended columns missing
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

  // Initials avatar
  const initials = (form.full_name || user?.email || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar title="Profile" />

        <div className="px-8 py-6 max-w-5xl">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Manage your account and business details.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left: Identity card ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col items-center text-center gap-4">
              {/* Avatar with hover overlay */}
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-homie-blue flex items-center justify-center text-white text-2xl font-bold shadow-lg select-none">
                  {initials}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <span className="text-white text-xs font-medium">Change Photo</span>
                </div>
              </div>

              <div>
                <p className="text-xl font-bold text-gray-800">{form.full_name || '—'}</p>
                {form.business_name && (
                  <p className="text-sm text-gray-500 mt-0.5">{form.business_name}</p>
                )}
              </div>

              {/* Badge */}
              <span className="text-xs px-3 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">
                Owner Account
              </span>

              <div className="w-full border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-left">
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-400 w-14 shrink-0">Email</span>
                  <span className="text-gray-700 text-xs truncate">{user?.email}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-400 w-14 shrink-0">Joined</span>
                  <span className="text-gray-700 text-xs">{joinedDate}</span>
                </div>
                {(form.city || form.state) && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-gray-400 w-14 shrink-0">Location</span>
                    <span className="text-gray-700 text-xs">{[form.city, form.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                <div className="flex gap-2 text-sm">
                  <span className="text-gray-400 w-14 shrink-0">ID</span>
                  <span className="text-gray-400 text-xs truncate font-mono">{user?.id?.slice(0, 12)}…</span>
                </div>
              </div>
            </div>

            {/* ── Right: Edit form ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-700 dark:text-gray-100 mb-5">Profile Details</h2>

                {loading ? (
                  <p className="text-gray-400 text-sm">Loading...</p>
                ) : (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Full Name</label>
                        <input
                          value={form.full_name}
                          onChange={e => setForm({ ...form, full_name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Phone</label>
                        <input
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="10-digit mobile"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-1">PG Business Name</label>
                      <input
                        value={form.business_name}
                        onChange={e => setForm({ ...form, business_name: e.target.value })}
                        placeholder="e.g. Sharma PG Group"
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-homie-blue/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">City</label>
                        <input
                          value={form.city}
                          onChange={e => setForm({ ...form, city: e.target.value })}
                          placeholder="City"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">State</label>
                        <input
                          value={form.state}
                          onChange={e => setForm({ ...form, state: e.target.value })}
                          placeholder="State"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/30"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-homie-blue text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-all"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      {saved && (
                        <span className="text-homie-green text-sm font-medium">✅ Saved!</span>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Sign Out — single canonical location */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-red-100 dark:border-red-700">
                <h2 className="font-semibold text-gray-700 dark:text-gray-100 mb-1">Sign Out</h2>
                <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">
                  You'll be returned to the HomiePG homepage.
                </p>
                <button
                  onClick={handleSignOut}
                  className="border border-red-300 text-red-500 px-5 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
