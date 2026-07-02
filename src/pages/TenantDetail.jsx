import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function TenantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [tenant, setTenant] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [docType, setDocType] = useState('aadhaar')
  const [docNumber, setDocNumber] = useState('')
  const [file, setFile] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [id])

  async function fetchAll() {
    setLoading(true)
    const { data: t } = await supabase
      .from('tenants')
      .select('*, buildings(name)')
      .eq('id', id)
      .single()
    setTenant(t)

    const { data: docs } = await supabase
      .from('tenant_documents')
      .select('*')
      .eq('tenant_id', id)
      .order('created_at', { ascending: false })
    setDocuments(docs || [])

    setLoading(false)
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return alert('Please select a file')

    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const filePath = `${user.id}/${id}/${docType}-${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('tenant-documents')
      .upload(filePath, file)

    if (uploadError) {
      alert(uploadError.message)
      setUploading(false)
      return
    }

    const { error: insertError } = await supabase.from('tenant_documents').insert({
      tenant_id: id,
      document_type: docType,
      document_number: docNumber,
      file_url: filePath,
      verified: false
    })

    if (insertError) {
      alert(insertError.message)
    } else {
      setDocNumber('')
      setFile(null)
      fetchAll()
    }
    setUploading(false)
  }

  async function viewDocument(filePath) {
    const { data, error } = await supabase.storage
      .from('tenant-documents')
      .createSignedUrl(filePath, 60) // link valid for 60 seconds

    if (error) {
      alert('Could not open file: ' + error.message)
      return
    }
    window.open(data.signedUrl, '_blank')
  }

  async function toggleVerified(docId, current) {
    await supabase.from('tenant_documents').update({ verified: !current }).eq('id', docId)
    fetchAll()
  }

  async function deleteDocument(docId, filePath) {
    if (!confirm('Delete this document?')) return
    await supabase.storage.from('tenant-documents').remove([filePath])
    await supabase.from('tenant_documents').delete().eq('id', docId)
    fetchAll()
  }

  if (loading) return <p className="p-8 text-gray-400">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar title={tenant?.full_name || 'Tenant'} />

        <div className="px-8 py-6 max-w-3xl">
          <button onClick={() => navigate('/tenants')} className="text-homie-blue text-sm mb-4">
            ← Back to Tenants
          </button>

          {/* Tenant Info */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">Tenant Info</h2>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="text-gray-500">Name</p>
              <p className="text-gray-800">{tenant?.full_name}</p>
              <p className="text-gray-500">Phone</p>
              <p className="text-gray-800">{tenant?.phone || '-'}</p>
              <p className="text-gray-500">Email</p>
              <p className="text-gray-800">{tenant?.email || '-'}</p>
              <p className="text-gray-500">Building</p>
              <p className="text-gray-800">{tenant?.buildings?.name}</p>
              <p className="text-gray-500">Joining Date</p>
              <p className="text-gray-800">{tenant?.joining_date || '-'}</p>
              <p className="text-gray-500">Monthly Rent</p>
              <p className="text-gray-800">₹{tenant?.monthly_rent}</p>
              <p className="text-gray-500">Deposit</p>
              <p className="text-gray-800">₹{tenant?.deposit}</p>
              <p className="text-gray-500">Status</p>
              <p className="text-gray-800 capitalize">{tenant?.status}</p>
            </div>
          </div>

          {/* Upload KYC */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">Upload KYC Document</h2>
            <form onSubmit={handleUpload} className="space-y-3">
              <div className="flex gap-3">
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="aadhaar">Aadhaar</option>
                  <option value="pan">PAN</option>
                  <option value="other">Other</option>
                </select>
                <input
                  placeholder="Document Number"
                  value={docNumber}
                  onChange={e => setDocNumber(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={e => setFile(e.target.files[0])}
                className="w-full text-sm"
              />
              <button
                type="submit"
                disabled={uploading}
                className="bg-homie-blue text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>
          </div>

          {/* Documents List */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Documents</h2>
            {documents.length === 0 ? (
              <p className="text-sm text-gray-400">No documents uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 capitalize">{doc.document_type}</p>
                      <p className="text-xs text-gray-500">{doc.document_number || 'No number provided'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        doc.verified ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'
                      }`}>
                        {doc.verified ? 'Verified' : 'Pending'}
                      </span>
                      <button
                        onClick={() => viewDocument(doc.file_url)}
                        className="text-xs text-homie-blue font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => toggleVerified(doc.id, doc.verified)}
                        className="text-xs text-gray-500 font-medium"
                      >
                        {doc.verified ? 'Unverify' : 'Verify'}
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id, doc.file_url)}
                        className="text-xs text-red-500 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}