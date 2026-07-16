export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-10 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">About HomiePG</p>
          <h1 className="mt-4 text-4xl font-semibold">Modern hosting for modern PG businesses.</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">HomiePG brings owners, tenants, and administrators into a single workspace where bookings, payments, verification, and communication stay organized and secure.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold">Our Mission</h2>
            <p className="mt-3 text-sm text-slate-400">To simplify PG operations for owners while giving tenants a frictionless and trustworthy stay experience.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold">Our Vision</h2>
            <p className="mt-3 text-sm text-slate-400">To build the default digital backbone for shared living communities across India and emerging markets.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold">Why HomiePG</h2>
            <p className="mt-3 text-sm text-slate-400">Because manual spreadsheets, missed rent, and scattered communication create avoidable stress for everyone involved.</p>
          </div>
        </div>
        <div className="mt-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center">
          <h2 className="text-xl font-semibold">Get in Touch</h2>
          <p className="mt-3 text-sm text-slate-400">
            Have questions or want to partner with us? Reach out directly via email.
          </p>
          <a href="mailto:hello@homiepg.com" className="mt-4 inline-block rounded-full bg-cyan-600 px-6 py-2 text-sm font-medium text-white hover:bg-cyan-500">
            Contact us through mail
          </a>
        </div>
      </div>
    </div>
  )
}
