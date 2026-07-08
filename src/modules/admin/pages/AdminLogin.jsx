import { Link } from 'react-router-dom'

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Super admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Admin portal</h1>
        <p className="mt-2 text-slate-400">Access platform operations and insights.</p>
        <div className="mt-6 space-y-3">
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none" placeholder="Email" />
          <input className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none" placeholder="Password" />
          <button className="w-full rounded-2xl bg-cyan-600 px-4 py-3 font-semibold text-white">Sign in</button>
        </div>
        <div className="mt-4 text-sm text-slate-400">
          <Link to="/admin/forgot-password" className="text-cyan-400">Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}
