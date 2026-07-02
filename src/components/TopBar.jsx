import { useAuth } from '../contexts/AuthContext'

export default function TopBar({ title }) {
  const { profile, signOut } = useAuth()

  return (
    <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">👋 {profile?.full_name || 'Owner'}</span>
        <button
          onClick={signOut}
          className="text-sm bg-red-50 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-100 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}