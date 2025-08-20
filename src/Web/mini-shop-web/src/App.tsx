import { useMemo, useState } from 'react'
import Pagination from './components/Pagination'
import ProductForm from './components/ProductForm'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useProduct } from './hooks/useProducts'
import type { ProductSummaryDto } from './types/products'

export default function App() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<string | undefined>(undefined)
  const [activeOnly, setActiveOnly] = useState<boolean | undefined>(undefined)

  const [modal, setModal] = useState<{ mode: 'create' | 'edit', id?: string } | null>(null)

  const { data, isFetching } = useProducts({ page, pageSize, search, sort, activeOnly })

  const createM = useCreateProduct()
  const deleteM = useDeleteProduct()
  const editing = useProduct(modal?.id)

  const onSort = (key: string) => setSort(prev => prev === key ? `-${key}` : key)

  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Products</h1>

      <section style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <input
          placeholder="Search name or SKU…"
          value={search} onChange={e => { setPage(1); setSearch(e.target.value) }}
        />
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={!!activeOnly}
                 onChange={e => { setPage(1); setActiveOnly(e.target.checked ? true : undefined) }} />
          Active only
        </label>
        <button onClick={() => setModal({ mode: 'create' })}>+ New product</button>
      </section>

      <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={{ textAlign: 'left', padding: 8, cursor: 'pointer' }} onClick={() => onSort('name')}>Name</th>
              <th style={{ textAlign: 'left', padding: 8, cursor: 'pointer' }} onClick={() => onSort('price')}>Price</th>
              <th style={{ textAlign: 'left', padding: 8 }}>SKU</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Active</th>
              <th style={{ width: 180 }}></th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((p: ProductSummaryDto) => (
              <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{p.name}</td>
                <td style={{ padding: 8 }}>{p.price.toFixed(2)}</td>
                <td style={{ padding: 8 }}>{p.sku}</td>
                <td style={{ padding: 8 }}>{p.isActive ? 'Yes' : 'No'}</td>
                <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                  <button onClick={() => setModal({ mode: 'edit', id: p.id })}>Edit</button>
                  <button onClick={() => {
                    if (confirm('Delete this product?')) deleteM.mutate(p.id)
                  }}>Delete</button>
                </td>
              </tr>
            ))}
            {data?.items.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 16, textAlign: 'center' }}>No products</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{isFetching ? 'Loading…' : `Total: ${data?.totalCount ?? 0}`}</span>
        <Pagination page={page} pageSize={pageSize} total={data?.totalCount ?? 0} onPage={setPage} />
      </div>

      {/* Modal (simple) */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'grid', placeItems: 'center', padding: 16
        }}>
          <div style={{ background: 'white', padding: 16, borderRadius: 8, minWidth: 380 }}>
            <h3 style={{ marginTop: 0 }}>{modal.mode === 'create' ? 'New product' : 'Edit product'}</h3>
            <ProductForm
              mode={modal.mode}
              initial={modal.mode === 'edit' ? editing.data : undefined}
              onCancel={() => setModal(null)}
              onSubmit={(payload) => {
                if (modal.mode === 'create') {
                  createM.mutate(payload as any, { onSuccess: () => setModal(null) })
                } else if (modal.id) {
                  const { useUpdateProduct } = require('./hooks/useProducts') // lazy to avoid hook condition
                  const updateM = useUpdateProduct(modal.id)
                  updateM.mutate(payload as any, { onSuccess: () => setModal(null) })
                }
              }}
            />
          </div>
        </div>
      )}
    </main>
  )
}
