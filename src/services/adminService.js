import { supabase } from '../lib/supabase'

export async function getAdminStats() {
  const { data, error } = await supabase.rpc('get_admin_dashboard_stats')
  if (error) {
    console.error('Error fetching admin stats:', error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function getAdminOwners() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'owner')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getAdminTenants() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'tenant')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getAdminBuildings() {
  const { data, error } = await supabase
    .from('buildings')
    .select(`
      id,
      name,
      city,
      area,
      status,
      created_at,
      owner:owner_id(full_name, email)
    `)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getAdminBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      start_date,
      rent_amount,
      deposit_amount,
      created_at,
      tenant:tenant_id(full_name, email),
      building:building_id(name)
    `)
    .order('created_at', { ascending: false })
  return { data, error }
}
