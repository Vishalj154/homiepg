import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

export default function TenantBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [activeTab, setActiveTab] = useState('All')
  const tabs = ['All', 'Pending', 'Approved', 'Completed', 'Rejected']

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  async function fetchBookings() {
    setLoading(true)
    setError(null)
    try {
      // First get the tenant id for this user profile
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .eq('profile_id', user.id)
        .single()
        
      if (tenantError && tenantError.code !== 'PGRST116') {
        throw tenantError
      }
      
      if (!tenantData) {
        setBookings([])
        return
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_date,
          status,
          amount,
          deposit,
          beds (
            id,
            bed_number,
            monthly_rent,
            rooms (
              id,
              room_number,
              buildings (
                id,
                name,
                address,
                city,
                image_url
              )
            )
          )
        `)
        .eq('tenant_id', tenantData.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Could not load your bookings at this time.')
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = activeTab === 'All' 
    ? bookings 
    : bookings.filter(b => b.status.toLowerCase() === activeTab.toLowerCase())

  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      <div className="px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-100 mb-1">My Bookings</h1>
        <p className="text-gray-400 text-sm mb-8">Track confirmed, pending, and past stays.</p>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl border border-white/5 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-4">
              🛏️
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No bookings found</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              {activeTab === 'All' 
                ? "You haven't made any bookings yet. Start searching for your perfect PG today!"
                : `You don't have any ${activeTab.toLowerCase()} bookings.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => {
              const bed = booking.beds
              const room = bed?.rooms
              const building = room?.buildings
              
              return (
                <div key={booking.id} className="bg-slate-900 rounded-2xl border border-white/5 p-6 flex flex-col sm:flex-row gap-6 hover:border-white/10 transition-colors">
                  <div className="w-full sm:w-48 h-32 bg-slate-800 rounded-xl overflow-hidden shrink-0">
                    {building?.image_url ? (
                      <img src={building.image_url} alt={building?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs uppercase tracking-widest">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-white">{building?.name || 'Unknown PG'}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          booking.status === 'approved' ? 'bg-cyan-500/20 text-cyan-400' :
                          booking.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          booking.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-1">
                        📍 {building?.address || 'Address not available'}, {building?.city}
                      </p>
                      <p className="text-slate-400 text-sm">
                        🛏️ Room {room?.room_number || '?'} • Bed {bed?.bed_number || '?'}
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Booking Date</p>
                        <p className="text-sm text-slate-300 font-medium">
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Monthly Rent</p>
                        <p className="text-sm text-slate-300 font-medium">₹{bed?.monthly_rent || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Deposit</p>
                        <p className="text-sm text-slate-300 font-medium">₹{booking.deposit || 0}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        {booking.status === 'approved' && (
                          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors">
                            Pay Rent
                          </button>
                        )}
                        <button className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 rounded-lg text-sm font-medium transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
