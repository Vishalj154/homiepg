import { Link, useLocation } from 'react-router-dom'

export default function ModuleShell({ title, subtitle, navItems, children, accent = 'from-cyan-500 to-blue-600' }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
          <div className={`rounded-2xl bg-gradient-to-r ${accent} p-4 text-white`}>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] opacity-80">HomiePG</p>
            <h2 className="mt-2 text-xl font-semibold">{title}</h2>
            <p className="mt-1 text-sm opacity-90">{subtitle}</p>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${active ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs opacity-70">{item.icon}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">{title}</p>
                <h1 className="text-2xl font-semibold">{subtitle}</h1>
              </div>
              <div className="rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300">
                Premium experience
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
