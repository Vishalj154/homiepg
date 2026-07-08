export default function StatCard({ title, value, detail, icon, accent = 'text-cyan-600' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
        <div className={`rounded-xl bg-slate-100 p-3 text-xl ${accent} dark:bg-slate-800`}>{icon}</div>
      </div>
    </div>
  )
}
