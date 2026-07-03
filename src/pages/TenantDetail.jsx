import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

export default function TenantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const payFormRef = useRef(null)

  const [tenant, setTenant] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [docType, setDocType] = useState('aadhaar')
  const [docNumber, setDocNumber] = useState('')
  const [file, setFile] = useState(null)

  const [payments, setPayments] = useState([])
  const [payUploading, setPayUploading] = useState(false)
  const [payForm, setPayForm] = useState({
    month: '',
    amount: '',
    payment_date: '',
    payment_method: 'cash',
  })
  const [receiptFile, setReceiptFile] = useState(null)

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

    const { data: pays } = await supabase
      .from('rent_payments')
      .select('*')
      .eq('tenant_id', id)
      .order('month', { ascending: false })
    setPayments(pays || [])

    setLoading(false)
  }

  // --- Documents ---
  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return alert('Please select a file')
    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const filePath = `${user.id}/${id}/${docType}-${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage.from('tenant-documents').upload(filePath, file)
    if (uploadError) { alert(uploadError.message); setUploading(false); return }

    const { error: insertError } = await supabase.from('tenant_documents').insert({
      tenant_id: id, document_type: docType, document_number: docNumber, file_url: filePath, verified: false,
    })
    if (insertError) { alert(insertError.message) } else { setDocNumber(''); setFile(null); fetchAll() }
    setUploading(false)
  }

  async function viewDocument(filePath) {
    const { data, error } = await supabase.storage.from('tenant-documents').createSignedUrl(filePath, 60)
    if (error) return alert('Could not open file: ' + error.message)
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

  // --- Payments ---
  function prefillCurrentMonth() {
    setPayForm({
      month: currentMonth,
      amount: tenant?.monthly_rent?.toString() || '',
      payment_date: new Date().toISOString().slice(0, 10),
      payment_method: 'cash',
    })
    setTimeout(() => payFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  async function handleAddPayment(e) {
    e.preventDefault()
    setPayUploading(true)
    const { data: { user } } = await supabase.auth.getUser()

    let receiptUrl = null
    if (receiptFile) {
      const filePath = `${user.id}/${id}/${Date.now()}-${receiptFile.name}`
      const { error: uploadError } = await supabase.storage.from('rent-receipts').upload(filePath, receiptFile)
      if (uploadError) { alert(uploadError.message); setPayUploading(false); return }
      receiptUrl = filePath
    }

    const { error } = await supabase.from('rent_payments').insert({
      tenant_id: id, month: payForm.month, amount: parseFloat(payForm.amount),
      payment_date: payForm.payment_date, payment_method: payForm.payment_method,
      receipt_url: receiptUrl, status: 'paid',
    })

    if (!error) {
      setPayForm({ month: '', amount: tenant?.monthly_rent || '', payment_date: '', payment_method: 'cash' })
      setReceiptFile(null)
      fetchAll()
    } else {
      alert(error.message)
    }
    setPayUploading(false)
  }

  async function viewReceipt(filePath) {
    const { data, error } = await supabase.storage.from('rent-receipts').createSignedUrl(filePath, 60)
    if (error) return alert(error.message)
    window.open(data.signedUrl, '_blank')
  }

  async function deletePayment(paymentId, receiptUrl) {
    if (!confirm('Delete this payment record?')) return
    if (receiptUrl) await supabase.storage.from('rent-receipts').remove([receiptUrl])
    await supabase.from('rent_payments').delete().eq('id', paymentId)
    fetchAll()
  }

  const isPaidThisMonth = payments.some(p => p.month?.startsWith(currentMonth) && p.status === 'paid')
  const isKycVerified = documents.some(d => d.verified)

  // Initials
  const initials = (tenant?.full_name || '?')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  if (loading) return <p className="p-8 text-gray-400">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar title={tenant?.full_name || 'Tenant'} />

        <div className="px-8 py-6 max-w-3xl">
          <button onClick={() => navigate('/tenants')} className="text-homie-blue text-sm mb-4 hover:underline">
            ← Back to Tenants
          </button>

          {/* ── Profile header card ── */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-start gap-5">
              {/* Initials avatar */}
              <div className="w-16 h-16 rounded-full bg-homie-blue flex items-center justify-center text-white text-xl font-bold shrink-0 shadow">
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{tenant?.full_name}</h2>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    tenant?.status === 'active'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {tenant?.status === 'active' ? 'Active' : 'Moved Out'}
                    </span>
                    {isKycVerified && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-200 font-medium">
                      ✅ KYC Verified
                    </span>
                  )}
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  {tenant?.buildings?.name && (
                    <p className="text-gray-500 dark:text-gray-400">🏢 {tenant.buildings.name}</p>
                  )}
                  {tenant?.joining_date && (
                    <p className="text-gray-500 dark:text-gray-400">📅 Joined {tenant.joining_date}</p>
                  )}
                  {tenant?.monthly_rent && (
                    <p className="text-gray-500 dark:text-gray-400">💰 ₹{tenant.monthly_rent}/month</p>
                  )}
                  {tenant?.deposit && (
                    <p className="text-gray-500 dark:text-gray-400">🔒 Deposit ₹{tenant.deposit}</p>
                  )}
                  {tenant?.phone && (
                    <p className="text-gray-500 dark:text-gray-400">📞 {tenant.phone}</p>
                  )}
                  {tenant?.email && (
                    <p className="text-gray-500 dark:text-gray-400">✉️ {tenant.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Upload KYC ── */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-6">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Upload KYC Document</h2>
            <form onSubmit={handleUpload} className="space-y-3">
              <div className="flex gap-3">
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                >
                  <option value="aadhaar">Aadhaar</option>
                  <option value="pan">PAN</option>
                  <option value="other">Other</option>
                </select>
                <input
                  placeholder="Document Number"
                  value={docNumber}
                  onChange={e => setDocNumber(e.target.value)}
                  className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={e => setFile(e.target.files[0])}
                className="w-full text-sm text-gray-800 dark:text-gray-100"
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

          {/* ── Documents List ── */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-6">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Documents</h2>
            {documents.length === 0 ? (
              <p className="text-sm text-gray-400">No documents uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-900">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-100 capitalize">{doc.document_type}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{doc.document_number || 'No number provided'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded ${doc.verified ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}>
                        {doc.verified ? 'Verified' : 'Pending'}
                      </span>
                      <button onClick={() => viewDocument(doc.file_url)} className="text-xs text-homie-blue font-medium">View</button>
                      <button onClick={() => toggleVerified(doc.id, doc.verified)} className="text-xs text-gray-500 dark:text-gray-300 font-medium">
                        {doc.verified ? 'Unverify' : 'Verify'}
                      </button>
                      <button onClick={() => deleteDocument(doc.id, doc.file_url)} className="text-xs text-red-500 font-medium">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Rent Payments ── */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5" ref={payFormRef}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">Rent Payments</h2>
              <div className="flex items-center gap-3">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                  isPaidThisMonth ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                }`}>
                  {isPaidThisMonth ? '✅ Paid This Month' : '⚠️ Due This Month'}
                </span>
                {!isPaidThisMonth && (
                  <button
                    onClick={prefillCurrentMonth}
                    className="text-xs bg-homie-blue text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-all"
                  >
                    Mark This Month as Paid
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-3 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    placeholder="Month (YYYY-MM, e.g. 2026-07)"
                    value={payForm.month}
                    onChange={e => setPayForm({ ...payForm, month: e.target.value })}
                    required
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  />
                  <p className="text-xs text-gray-400 mt-1">Use YYYY-MM format for auto-detection</p>
                </div>
                <input
                  type="number"
                  placeholder="Amount"
                  value={payForm.amount}
                  onChange={e => setPayForm({ ...payForm, amount: e.target.value })}
                  required
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={payForm.payment_date}
                  onChange={e => setPayForm({ ...payForm, payment_date: e.target.value })}
                  required
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
                <select
                  value={payForm.payment_method}
                  onChange={e => setPayForm({ ...payForm, payment_method: e.target.value })}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Receipt Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={e => setReceiptFile(e.target.files[0])}
                  className="w-full text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={payUploading}
                className="bg-homie-green text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {payUploading ? 'Saving...' : 'Mark as Paid'}
              </button>
            </form>

            {payments.length === 0 ? (
              <p className="text-sm text-gray-400">No payments recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {payments.map(p => (
                  <div key={p.id} className="flex items-center justify-between border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-900">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-100">{p.month}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">₹{p.amount} — {p.payment_method} — {p.payment_date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300">{p.status}</span>
                      {p.receipt_url && (
                        <button onClick={() => viewReceipt(p.receipt_url)} className="text-xs text-homie-blue font-medium">Receipt</button>
                      )}
                      <button onClick={() => deletePayment(p.id, p.receipt_url)} className="text-xs text-red-500 font-medium">Delete</button>
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