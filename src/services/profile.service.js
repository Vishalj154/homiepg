import { supabase } from '../lib/supabase'

export async function upsertProfile(profile) {
  const payload = {
    id: profile.id,
    full_name: profile.full_name || profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    role: profile.role || 'tenant',
    avatar_url: profile.avatar_url || null,
    created_at: profile.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' }).select().single()
  return { data, error }
}

export async function updateProfileFields(userId, updates) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single()
  return { data, error }
}
