type Props = { page: number; pageSize: number; total: number; onPage: (p: number) => void }
export default function Pagination({ page, pageSize, total, onPage }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button disabled={page <= 1} onClick={() => onPage(1)}>« First</button>
      <button disabled={page <= 1} onClick={() => onPage(page - 1)}>‹ Prev</button>
      <span>Page {page} / {pages}</span>
      <button disabled={page >= pages} onClick={() => onPage(page + 1)}>Next ›</button>
      <button disabled={page >= pages} onClick={() => onPage(pages)}>Last »</button>
    </div>
  )
}
