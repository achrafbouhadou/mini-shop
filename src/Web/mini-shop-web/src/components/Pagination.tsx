type Props = { page: number; pageSize: number; total: number; onPage: (p: number) => void }
export default function Pagination({ page, pageSize, total, onPage }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="flex items-center gap-2 text-sm">
      <button className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-40 transition-base" disabled={page <= 1} onClick={() => onPage(1)}>« First</button>
      <button className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-40 transition-base" disabled={page <= 1} onClick={() => onPage(page - 1)}>‹ Prev</button>
      <span className="text-slate-600">Page {page} / {pages}</span>
      <button className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-40 transition-base" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next ›</button>
      <button className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-40 transition-base" disabled={page >= pages} onClick={() => onPage(pages)}>Last »</button>
    </div>
  )
}
