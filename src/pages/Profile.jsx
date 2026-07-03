import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function Profile() {
  const { user, profile: authProfile, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    pg_name: '',
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
        pg_name: data.pg_name || '',
        city: data.city || '',
        state: data.state || '',
      })
    }
    setLoading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    // full_name is guaranteed to exist in profiles
    const baseUpdate = { full_name: form.full_name }
    // Extended fields — only included if they exist on the table
    const extended = {
      ...(form.phone !== undefined && { phone: form.phone }),
      ...(form.pg_name !== undefined && { pg_name: form.pg_name }),
      ...(form.city !== undefined && { city: form.city }),
      ...(form.state !== undefined && { state: form.state }),
    }

    const { error } = await supabase
      .from('profiles')
      .update({ ...baseUpdate, ...extended })
      .eq('id', user.id)

    if (error) {
      // If extended columns don't exist, fall back to just full_name
      if (error.message?.includes('column')) {
        const { error: fallbackError } = await supabase
          .from('profiles')
          .update(baseUpdate)
          .eq('id', user.id)
        if (fallbackError) {
          alert(fallbackError.message)
          setSaving(false)
          return
        }
      } else {
        alert(error.message)
        setSaving(false)
        return
      }
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    fetchProfile()
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar title="Profile" />

        <div className="px-8 py-6 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">My Profile</h1>
          <p className="text-gray-500 text-sm mb-8">Manage your account details.</p>

          {/* Account info (read-only) */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h2 className="font-semibold text-gray-700 mb-3">Account</h2>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="text-gray-500">Email</p>
              <p className="text-gray-800">{user?.email}</p>
              <p className="text-gray-500">User ID</p>
              <p className="text-gray-500 text-xs truncate">{user?.id}</p>
              <p className="text-gray-500">Joined</p>
              <p className="text-gray-800">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
          </div>

          {/* Editable profile */}
          {loading ? (
            <p className="text-gray-400">Loading profile...</p>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-semibold text-gray-700 mb-4">Profile Details</h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Full Name</label>
                  <input
                    value={form.full_name}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/30"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/30"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">PG Business Name</label>
                  <input
                    value={form.pg_name}
                    onChange={e => setForm({ ...form, pg_name: e.target.value })}
                    placeholder="e.g. Sharma PG Group"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">City</label>
                    <input
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="City"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">State</label>
                    <input
                      value={form.state}
                      onChange={e => setForm({ ...form, state: e.target.value })}
                      placeholder="State"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue/30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-homie-blue text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-all"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  {saved && (
                    <span className="text-homie-green text-sm font-medium">✅ Saved!</span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Danger zone */}
          <div className="bg-white rounded-xl shadow-sm p-5 mt-6 border border-red-100">
            <h2 className="font-semibold text-red-500 mb-1">Sign Out</h2>
            <p className="text-sm text-gray-500 mb-3">You'll be redirected to the login page.</p>
            <button
              onClick={signOut}
              className="bg-red-50 text-red-500 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
