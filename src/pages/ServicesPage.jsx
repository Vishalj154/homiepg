export default function ServicesPage() {
  const services = [
    ['Property Management', 'Coordinate buildings, rooms, beds, maintenance, and occupancy from one place.'],
    ['Tenant Management', 'Track tenant profiles, bookings, documents, and communication history.'],
    ['Online Booking', 'Let tenants search, reserve, and confirm beds through an end-to-end flow.'],
    ['Digital Rent Collection', 'Collect rent, store receipts, and reduce missed payments with reminders.'],
    ['KYC Verification', 'Review and approve documents with a structured verification workflow.'],
    ['Analytics', 'Monitor occupancy, revenue, debt, and growth with live dashboards.'],
  ]

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-600">Services</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">Everything your PG business needs to run smoothly.</h1>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map(([title, body]) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
