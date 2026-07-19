import { supabase } from '../lib/supabase'

export async function fetchPublicBuildings({ limit = 10, city = '', type = '' } = {}) {
  let query = supabase
    .from('buildings')
    .select(`
      id,
      name,
      city,
      area,
      address,
      gender_type,
      image_url,
      status,
      created_at
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (city) {
    query = query.ilike('city', `%${city}%`)
  }
  
  if (type && type !== 'all') {
    query = query.eq('gender_type', type)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) {
    console.error('Error fetching public buildings:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function searchBuildings(searchQuery) {
  if (!searchQuery) return fetchPublicBuildings()
  
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('status', 'active')
    .or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,area.ilike.%${searchQuery}%`)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getBuildingDetails(id) {
  const { data, error } = await supabase
    .from('buildings')
    .select(`
      *,
      rooms (
        id,
        room_number,
        capacity,
        status,
        beds (
          id,
          bed_number,
          status,
          monthly_rent,
          deposit
        )
      ),
      amenities (
        id,
        name
      )
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

export async function getBedDetails(bedId) {
  const { data, error } = await supabase
    .from('beds')
    .select(`
      *,
      room:rooms (
        id,
        room_number,
        building:buildings (
          id,
          name
        )
      )
    `)
    .eq('id', bedId)
    .single()

  return { data, error }
}
