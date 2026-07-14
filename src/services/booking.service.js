import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'homiepg-bookings'

export async function createBooking(payload) {
  try {
    const { data, error } = await supabase.from('bookings').insert(payload).select().single()
    if (!error) return { data, error: null }
  } catch (error) {
    console.warn('Supabase booking insert failed, falling back to local storage', error)
  }

  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  const created = {
    id: `${Date.now()}`,
    ...payload,
    status: 'pending',
    created_at: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, created]))
  return { data: created, error: null }
}

export async function getBookingsForUser(userId) {
  try {
    const { data, error } = await supabase.from('bookings').select('*').eq('tenant_id', userId).order('created_at', { ascending: false })
    if (!error) return data || []
  } catch (error) {
    console.warn('Supabase booking lookup failed; using local storage', error)
  }

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  return stored.filter((item) => item.tenant_id === userId)
}
