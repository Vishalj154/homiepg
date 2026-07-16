import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { fetchSavedPGs, removeSavedPG, getTenantProfileId } from '../../../services/tenant.service'

export default function TenantSaved() {
  const { user } = useAuth()
  const [savedPgs, setSavedPgs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadSaved()
  }, [user])

  async function loadSaved() {
    setLoading(true)
    const tenantId = await getTenantProfileId(user.id)
    if (tenantId) {
      const { data } = await fetchSavedPGs(tenantId)
      setSavedPgs(data || [])
    }
    setLoading(false)
  }

  async function handleRemove(id) {
    await removeSavedPG(id)
    setSavedPgs(savedPgs.filter(pg => pg.id !== id))
  }

  return (
    <div className="flex-1 bg-slate-950 pb-12">
      <div className="px-8 py-8 border-b border-white/5">
        <h1 className="text-2xl font-bold text-white mb-2">Saved Properties</h1>
        <p className="text-slate-400">Your favorite PGs saved for later.</p>
      </div>

      <div className="px-8 mt-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        ) : savedPgs.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl border border-white/5 p-16 text-center">
            <span className="text-4xl mb-4 block">❤️</span>
            <h3 className="text-lg font-medium text-white mb-2">No saved properties</h3>
            <p className="text-slate-400">When you find a PG you love, save it here to compare later.</p>
            <Link to="/tenant/search" className="mt-6 inline-block bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-medium transition-colors">
              Explore PGs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPgs.map(item => {
              const pg = item.buildings
              return (
                <div key={item.id} className="group bg-slate-900 rounded-2xl border border-white/5 overflow-hidden block relative">
                  <Link to={`/tenant/pg-details/${pg.id}`} className="block">
                    <div className="h-48 bg-slate-800 relative overflow-hidden">
                      {pg.image_url ? (
                        <img src={pg.image_url} alt={pg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">No Image</div>
                      )}
                      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10 capitalize">
                        {pg.gender_type}
                      </div>
                    </div>
                  </Link>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-4 right-4 h-8 w-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500/80 text-white transition-colors border border-white/20"
                    title="Remove from saved"
                  >
                    ×
                  </button>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white mb-1">{pg.name}</h3>
                    <p className="text-sm text-slate-400 mb-4 truncate">{pg.address}, {pg.city}</p>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <Link to={`/tenant/pg-details/${pg.id}`} className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                        View Details →
                      </Link>
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
