import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

export default function TenantNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNotifications() {
      if (!user) return
      setLoading(true)
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
      
      setNotifications(data || [])
      setLoading(false)
    }
    loadNotifications()
  }, [user])

  async function markAsRead(id) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  return (
    <div className="flex-1 bg-slate-950 pb-12">
      <div className="px-8 py-8 border-b border-white/5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-slate-400">Updates about your bookings and account.</p>
        </div>
      </div>

      <div className="px-8 mt-8 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl border border-white/5 p-12 text-center">
            <span className="text-4xl mb-4 block">📭</span>
            <h3 className="text-lg font-medium text-white mb-2">No notifications yet</h3>
            <p className="text-slate-400 text-sm">We'll let you know when there are updates.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-6 rounded-2xl border flex gap-4 ${
                  notification.is_read 
                    ? 'bg-slate-900 border-white/5 opacity-70' 
                    : 'bg-slate-800 border-cyan-900/50 shadow-[0_0_15px_rgba(8,145,178,0.1)]'
                }`}
              >
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${notification.is_read ? 'bg-transparent' : 'bg-cyan-500'}`}></div>
                <div className="flex-1">
                  <h3 className={`font-medium ${notification.is_read ? 'text-slate-300' : 'text-white'}`}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{notification.body}</p>
                  <p className="text-xs text-slate-500 mt-3">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.is_read && (
                  <button onClick={() => markAsRead(notification.id)} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium self-start">
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
