import { supabase } from '../../../lib/supabase'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
const CACHE_KEY = 'homiepg-public-pgs'

function readCachedPGs() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : []
  } catch {
    return []
  }
}

function writeCachedPGs(pgs) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(pgs))
  } catch {
    // ignore storage failures
  }
}

function toDisplayRent(index) {
  return 9000 + (index % 6) * 1000 + (index % 3) * 350
}

function toDisplayAmenities(building, index) {
  const amenities = []
  if (building.wifi_available || index % 2 === 0) amenities.push('WiFi')
  if (building.parking_available || index % 3 === 0) amenities.push('Parking')
  if (building.laundry_available || index % 4 === 1) amenities.push('Laundry')
  if (building.food_type || index % 2 === 1) amenities.push('Food')
  if (index % 3 === 0) amenities.push('AC')
  if (index % 5 === 0) amenities.push('Gym')
  if (index % 4 === 2) amenities.push('Security')
  return amenities
}

function normalizeBuilding(building, index) {
  const city = building.city || 'Bengaluru'
  const area = building.area || building.address?.split(',')[0] || 'Central'
  const rent = toDisplayRent(index)
  const occupancy = 58 + ((index + 3) % 28)
  const vacantBeds = 1 + (index % 4) + (building.total_floors ? Math.min(2, building.total_floors - 1) : 0)

  return {
    id: building.id,
    name: building.name || `${city} PG`,
    city,
    area,
    address: building.address || `${area}, ${city}`,
    rent: `₹${rent.toLocaleString()}`,
    rentValue: rent,
    rating: (4.3 + (index % 5) * 0.2).toFixed(1),
    beds: vacantBeds,
    vacantBeds,
    amenities: toDisplayAmenities(building, index),
    image: building.image_url || FALLBACK_IMAGE,
    gender: building.gender_type || 'unisex',
    food: building.food_type || 'both',
    ac: index % 3 !== 0 || Boolean(building.wifi_available),
    parking: Boolean(building.parking_available || index % 3 === 0),
    wifi: Boolean(building.wifi_available || index % 2 === 0),
    laundry: Boolean(building.laundry_available || index % 4 === 1),
    gym: index % 5 === 0,
    security: index % 4 !== 1,
    occupancy,
    description: building.description || `${building.name || 'Premium'} PG offers comfortable stay, clean rooms, and easy access to transit.`,
    waterSupply: building.water_supply_timing || '24x7',
    ownerId: building.owner_id,
  }
}

export async function getPublicPGs() {
  try {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const pgs = (data || []).map(normalizeBuilding)
    writeCachedPGs(pgs)
    return pgs
  } catch (error) {
    console.error('Failed to load public PG listings:', error)
    const cached = readCachedPGs()
    return cached.length ? cached : []
  }
}

export async function getPublicPGById(id) {
  try {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return normalizeBuilding(data, 0)
  } catch (error) {
    console.error('Failed to load public PG details:', error)
    const cached = readCachedPGs()
    return cached.find((pg) => pg.id === id) || null
  }
}
