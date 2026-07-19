import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ModuleShell from '../../shared/components/ModuleShell'
import SectionCard from '../../shared/components/SectionCard'
import { getBedDetails } from '../../../services/property.service'
import { createBooking } from '../../../services/booking.service'
import { useAuth } from '../../../contexts/AuthContext'

const navItems = [
  { label: 'Home', to: '/tenant', icon: '🏠' },
  { label: 'Search PG', to: '/tenant/search', icon: '🔎' },
  { label: 'Bookings', to: '/tenant/bookings', icon: '📅' },
  { label: 'Saved PGs', to: '/tenant/saved', icon: '💛' },
  { label: 'Payments', to: '/tenant/payments', icon: '💳' },
  { label: 'Notifications', to: '/tenant/notifications', icon: '🔔' },
  { label: 'Profile', to: '/tenant/profile', icon: '👤' },
  { label: 'Settings', to: '/tenant/settings', icon: '⚙️' },
  { label: 'Support', to: '/tenant/support', icon: '🆘' },
  { label: 'About', to: '/tenant/about', icon: 'ℹ️' },
]

export default function BookingPage() {
  const { bedId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bedDetails, setBedDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!bedId) return
    getBedDetails(bedId).then((res) => {
      if (res.data) setBedDetails(res.data)
      else setError('Failed to load bed details.')
      setLoading(false)
    })
  }, [bedId])

  const handleReserve = async () => {
    if (!user) {
      alert('Please log in to make a booking.')
      navigate('/tenant/login')
      return
    }
    
    setSubmitting(true)
    const payload = {
      tenant_id: user.id,
      bed_id: bedDetails.id,
      building_id: bedDetails.room?.building?.id,
      status: 'pending',
      start_date: new Date().toISOString().split('T')[0],
      rent_amount: bedDetails.monthly_rent,
      deposit_amount: bedDetails.deposit || 0
    }

    const { error: bookingError } = await createBooking(payload)
    setSubmitting(false)
    
    if (bookingError) {
      setError('Booking failed. Please try again.')
    } else {
      navigate('/tenant/bookings')
    }
  }

  if (loading) {
    return (
      <ModuleShell title="Tenant Module" subtitle="Booking" navItems={navItems} accent="from-violet-500 to-cyan-600">
        <div className="p-8 text-slate-600">Loading booking details...</div>
      </ModuleShell>
    )
  }

  if (error || !bedDetails) {
    return (
      <ModuleShell title="Tenant Module" subtitle="Booking" navItems={navItems} accent="from-violet-500 to-cyan-600">
        <div className="p-8 text-rose-500">{error || 'Bed not found.'}</div>
      </ModuleShell>
    )
  }

  const buildingName = bedDetails.room?.building?.name || 'Unknown Property'
  const bookingAmount = Number(bedDetails.monthly_rent) + Number(bedDetails.deposit || 0)

  return (
    <ModuleShell title="Tenant Module" subtitle="Booking" navItems={navItems} accent="from-violet-500 to-cyan-600">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <SectionCard title="Booking summary" subtitle="Selected bed confirmation">
          <div className="space-y-3">
            {[
              ['Selected bed', `Bed ${bedDetails.bed_number} (Room ${bedDetails.room?.room_number})`],
              ['Property', buildingName],
              ['Rent', `₹${bedDetails.monthly_rent}`],
              ['Deposit', `₹${bedDetails.deposit || 0}`],
              ['Booking amount', `₹${bookingAmount}`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Terms" subtitle="Please read before reserving">
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>• Deposit is refundable subject to policy.</p>
            <p>• Advance rent is collected on booking confirmation.</p>
            <p>• Bed reservation is pending owner confirmation.</p>
          </div>
          <button 
            onClick={handleReserve}
            disabled={submitting}
            className={`mt-4 w-full rounded-full px-4 py-3 font-semibold text-white transition ${submitting ? 'bg-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'}`}
          >
            {submitting ? 'Processing...' : 'Reserve bed'}
          </button>
        </SectionCard>
      </div>
    </ModuleShell>
  )
}
