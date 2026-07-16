import { supabase } from '../lib/supabase'

export async function fetchSavedPGs(tenantId) {
  if (!tenantId) return { data: null, error: 'No tenant ID provided' }
  const { data, error } = await supabase
    .from('saved_pgs')
    .select(`
      id,
      building_id,
      created_at,
      buildings (
        id,
        name,
        city,
        area,
        address,
        gender_type,
        image_url,
        status,
        monthly_rent:rooms(beds(monthly_rent))
      )
    `)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function removeSavedPG(savedId) {
  const { error } = await supabase
    .from('saved_pgs')
    .delete()
    .eq('id', savedId)
  
  return { error }
}

export async function getTenantProfileId(userId) {
  const { data } = await supabase
    .from('tenants')
    .select('id')
    .eq('profile_id', userId)
    .single()
    
  return data?.id
}
