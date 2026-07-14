import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'homiepg-notifications'

export async function getNotificationsForRole(role, profileId) {
  try {
    const { data, error } = await supabase.from('notifications').select('*').eq('profile_id', profileId).order('created_at', { ascending: false })
    if (!error) return data || []
  } catch (error) {
    console.warn('Supabase notifications unavailable, using local fallback', error)
  }

  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').filter((item) => item.role === role)
}

export async function seedNotificationsForRole(role, profileId) {
  const fallbackItems = [
    { role: 'owner', title: 'New booking', body: 'A tenant requested a bed in Skyline Nest PG.' },
    { role: 'owner', title: 'Payment received', body: 'Rent payment of ₹14,500 was marked paid.' },
    { role: 'tenant', title: 'Booking approved', body: 'Your bed reservation was approved.' },
    { role: 'tenant', title: 'Rent due', body: 'Rent for this month is due in 3 days.' },
    { role: 'super_admin', title: 'New owner registered', body: 'A new owner completed onboarding.' },
  ]

  const notifications = fallbackItems.filter((item) => item.role === role).map((item) => ({
    id: `${Date.now()}-${Math.random()}`,
    profile_id: profileId,
    title: item.title,
    body: item.body,
    is_read: false,
    created_at: new Date().toISOString(),
  }))

  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  return notifications
}
