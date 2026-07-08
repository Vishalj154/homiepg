import { Link } from 'react-router-dom'

export default function TenantAuth({ title, subtitle, cta }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-600 via-cyan-600 to-sky-700 p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Tenant portal</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{subtitle}</p>
        <div className="mt-6 space-y-3">
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Email" />
          <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Password" />
          <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">{cta}</button>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <Link to="/tenant/forgot-password" className="text-cyan-600">Forgot password?</Link>
          <Link to="/tenant/signup" className="text-cyan-600">Create account</Link>
        </div>
      </div>
    </div>
  )
}
