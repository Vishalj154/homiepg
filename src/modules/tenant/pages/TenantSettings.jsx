import { useAuth } from '../../../contexts/AuthContext'

export default function TenantSettings() {
  const { user } = useAuth()

  return (
    <div className="flex-1 bg-slate-950 pb-12">
      <div className="px-8 py-8 border-b border-white/5">
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences.</p>
      </div>

      <div className="px-8 mt-8 max-w-4xl space-y-6">
        
        <section className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">Account Settings</h2>
            <p className="text-sm text-slate-400">Update your email and password.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Email Address</label>
              <input type="email" disabled value={user?.email || ''} className="w-full sm:w-96 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-slate-300 opacity-60 cursor-not-allowed" />
              <p className="text-xs text-slate-500 mt-1">To change your email, please contact support.</p>
            </div>
            <div>
              <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10">
                Change Password
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
            <p className="text-sm text-slate-400">Choose what updates you want to receive.</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="font-medium text-white">Booking Updates</p>
                <p className="text-xs text-slate-400">Receive alerts when your booking status changes.</p>
              </div>
              <div className="w-11 h-6 bg-cyan-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="font-medium text-white">Payment Reminders</p>
                <p className="text-xs text-slate-400">Get notified when rent is due.</p>
              </div>
              <div className="w-11 h-6 bg-cyan-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-white">Marketing Emails</p>
                <p className="text-xs text-slate-400">Receive offers and platform updates.</p>
              </div>
              <div className="w-11 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
