import { supabase } from '../lib/supabase'

export async function getDashboardMetrics() {
  try {
    const [buildingsRes, bedsRes, bookingsRes, paymentsRes, tenantsRes] = await Promise.all([
      supabase.from('buildings').select('*', { count: 'exact', head: true }),
      supabase.from('beds').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('rent_payments').select('*', { count: 'exact', head: true }),
      supabase.from('tenants').select('*', { count: 'exact', head: true }),
    ])

    return {
      totalBuildings: buildingsRes.count || 0,
      totalBeds: bedsRes.count || 0,
      totalBookings: bookingsRes.count || 0,
      totalPayments: paymentsRes.count || 0,
      totalTenants: tenantsRes.count || 0,
    }
  } catch (error) {
    console.warn('Supabase analytics unavailable', error)
    return {
      totalBuildings: 0,
      totalBeds: 0,
      totalBookings: 0,
      totalPayments: 0,
      totalTenants: 0,
    }
  }
}
