import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const STATUS_LABELS = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
}

export default function Complaints() {
    const { user } = useAuth()
    const [complaints, setComplaints] = useState([])
    const [buildings, setBuildings] = useState([])
    const [tenants, setTenants] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [filterBuilding, setFilterBuilding] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [form, setForm] = useState({
        tenant_id: '',
        building_id: '',
        subject: '',
        description: '',
    })

    useEffect(() => {
        fetchAll()
    }, [user])

    async function fetchAll() {
        setLoading(true)
        const [buildingsRes, tenantsRes, complaintsRes] = await Promise.all([
            supabase.from('buildings').select('id, name').eq('owner_id', user?.id),
            supabase.from('tenants').select('id, full_name, building_id').eq('owner_id', user?.id),
            supabase.from('complaints')
                .select('*, tenants(full_name), buildings(name)')
                .eq('owner_id', user?.id)
                .order('created_at', { ascending: false }),
        ])

        setBuildings(buildingsRes.data || [])
        setTenants(tenantsRes.data || [])
        setComplaints(complaintsRes.data || [])
        setLoading(false)
    }

    async function handleAdd(e) {
        e.preventDefault()
        const { error } = await supabase.from('complaints').insert({
            owner_id: user.id,
            tenant_id: form.tenant_id || null,
            building_id: form.building_id || null,
            subject: form.subject,
            description: form.description,
            status: 'open',
        })

        if (error) {
            alert(error.message)
            return
        }

        setForm({ tenant_id: '', building_id: '', subject: '', description: '' })
        setShowForm(false)
        fetchAll()
    }

    async function handleUpdateStatus(complaint, newStatus) {
        await supabase.from('complaints').update({ status: newStatus }).eq('id', complaint.id)
        fetchAll()
    }

    async function handleDelete(id) {
        if (!confirm('Delete this complaint?')) return
        await supabase.from('complaints').delete().eq('id', id)
        fetchAll()
    }

    const filteredComplaints = complaints.filter(c => {
        const buildingMatch = filterBuilding === 'all' || c.building_id === filterBuilding
        const statusMatch = filterStatus === 'all' || c.status === filterStatus
        return buildingMatch && statusMatch
    })

    function handleTenantChange(value) {
        const tenant = tenants.find(t => t.id === value)
        setForm(prev => ({
            ...prev,
            tenant_id: value,
            building_id: tenant?.building_id || prev.building_id,
        }))
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <Sidebar />
            <div className="flex-1">
                <TopBar title="Complaints" />
                <div className="px-8 py-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                        <select
                            value={filterBuilding}
                            onChange={e => setFilterBuilding(e.target.value)}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        >
                            <option value="all">All Buildings</option>
                            {buildings.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        >
                            <option value="all">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setShowForm(prev => !prev)}
                        className="bg-homie-blue text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                        {showForm ? 'Cancel' : '+ Log Complaint'}
                    </button>
                </div>

                {showForm && (
<form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 space-y-4 max-w-2xl">
                    <h2 className="font-semibold text-slate-900 dark:text-gray-100">Log New Complaint</h2>

                        <select
                            value={form.tenant_id}
                            onChange={e => handleTenantChange(e.target.value)}
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        >
                            <option value="">Select Tenant (optional)</option>
                            {tenants.map(t => (
                                <option key={t.id} value={t.id}>{t.full_name}</option>
                            ))}
                        </select>

                        <select
                            value={form.building_id}
                            onChange={e => setForm(prev => ({ ...prev, building_id: e.target.value }))}
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        >
                            <option value="">Select Building (optional)</option>
                            {buildings.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>

                        <input
                            placeholder="Subject"
                            value={form.subject}
                            onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                            required
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        />

                        <textarea
                            rows={4}
                            placeholder="Description (optional)"
                            value={form.description}
                            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                        />

                        <button
                            type="submit"
                            className="w-full bg-homie-green text-white py-2.5 rounded-lg font-medium"
                        >
                            Save Complaint
                        </button>
                    </form>
                )}

                {loading ? (
                    <p className="text-gray-400">Loading complaints...</p>
                ) : filteredComplaints.length === 0 ? (
                    <p className="text-gray-400 text-center py-12">No complaints logged yet.</p>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-left">
                                <tr>
                                    <th className="px-5 py-3">Subject</th>
                                    <th className="px-5 py-3">Tenant</th>
                                    <th className="px-5 py-3">Building</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredComplaints.map(complaint => (
                                    <tr key={complaint.id} className="border-t border-gray-100 dark:border-gray-700">
                                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">{complaint.subject}</td>
                                        <td className="px-5 py-3 text-gray-500 dark:text-gray-300">{complaint.tenants?.full_name || '—'}</td>
                                        <td className="px-5 py-3 text-gray-500 dark:text-gray-300">{complaint.buildings?.name || '—'}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${complaint.status === 'open'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200'
                                                    : complaint.status === 'in_progress'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
                                                }`}>
                                                {STATUS_LABELS[complaint.status] || complaint.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-500 dark:text-gray-300">{new Date(complaint.created_at).toLocaleDateString('en-IN')}</td>
                                        <td className="px-5 py-3 flex flex-wrap items-center gap-2">
                                            <select
                                                value={complaint.status}
                                                onChange={e => handleUpdateStatus(complaint, e.target.value)}
                                                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                                            >
                                                <option value="open">Open</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                            <button
                                                onClick={() => handleDelete(complaint.id)}
                                                className="text-sm text-red-500 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
  )
}
