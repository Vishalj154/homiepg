import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'
import { getTenantProfileId } from '../../../services/tenant.service'

export default function TenantPayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPayments() {
      if (!user) return
      setLoading(true)
      const tenantId = await getTenantProfileId(user.id)
      if (tenantId) {
        const { data } = await supabase
          .from('payments')
          .select(`
            *,
            bookings (
              beds (
                rooms (
                  buildings (
                    name
                  )
                )
              )
            )
          `)
          .eq('tenant_id', tenantId)
          .order('payment_date', { ascending: false })
        
        setPayments(data || [])
      }
      setLoading(false)
    }
    loadPayments()
  }, [user])

  return (
    <div className="flex-1 bg-slate-950 pb-12">
      <div className="px-8 py-8 border-b border-white/5">
        <h1 className="text-2xl font-bold text-white mb-2">My Payments</h1>
        <p className="text-slate-400">Track your deposits, rent, and invoices.</p>
      </div>

      <div className="px-8 mt-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 rounded-2xl border border-white/5 p-6">
            <p className="text-sm text-slate-400 mb-1">Total Paid</p>
            <p className="text-3xl font-bold text-white">
              ₹{payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0)}
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl border border-white/5 p-6">
            <p className="text-sm text-slate-400 mb-1">Pending Dues</p>
            <p className="text-3xl font-bold text-amber-400">
              ₹{payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0)}
            </p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white mb-6">Payment History</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl border border-white/5 p-12 text-center">
            <span className="text-4xl mb-4 block">💳</span>
            <h3 className="text-lg font-medium text-white mb-2">No payments yet</h3>
            <p className="text-slate-400 text-sm">Your transaction history will appear here.</p>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-white block">Rent Payment</span>
                        <span className="text-xs text-slate-500">{payment.bookings?.beds?.rooms?.buildings?.name || 'PG Accommodation'}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        ₹{payment.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          payment.status === 'paid' ? 'bg-cyan-500/20 text-cyan-400' :
                          payment.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payment.status === 'pending' ? (
                          <button className="text-cyan-400 hover:text-cyan-300 font-medium">Pay Now</button>
                        ) : (
                          <button className="text-slate-400 hover:text-slate-300 font-medium">Receipt</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
