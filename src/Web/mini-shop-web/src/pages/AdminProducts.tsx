import { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import Pagination from '../components/Pagination'
import ProductForm from '../components/ProductForm'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useProduct } from '../hooks/useProducts'
import type { ProductSummaryDto } from '../types/products'

export default function AdminProducts() {
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
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products (Admin)</h1>
        <button onClick={() => setModal({ mode: 'create' })}
          className="inline-flex items-center rounded-xl bg-blue-600 text-white text-sm px-3 py-2 hover:bg-blue-700 active:scale-[.98]">
          + New product
        </button>
      </div>

      <section className="mb-3 flex flex-wrap items-center gap-3">
        <input
          className="h-10 rounded-xl border px-3 text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Search name or SKU…"
          value={search} onChange={e => { setPage(1); setSearch(e.target.value) }}
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={!!activeOnly}
            onChange={e => { setPage(1); setActiveOnly(e.target.checked ? true : undefined) }} />
          Active only
        </label>
        <span className="text-sm text-slate-500">{isFetching ? 'Loading…' : `Total: ${data?.totalCount ?? 0}`}</span>
      </section>

      <div className="overflow-x-auto border rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="p-3 cursor-pointer" onClick={() => onSort('name')}>Name</th>
              <th className="p-3 cursor-pointer" onClick={() => onSort('price')}>Price</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Active</th>
              <th className="p-3 w-40"></th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((p: ProductSummaryDto, idx: number) => (
              <tr key={p.id} className="border-t odd:bg-slate-50/40">
                <td className="p-3">{p.name}</td>
                <td className="p-3">${p.price.toFixed(2)}</td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{p.isActive ? 'Yes' : 'No'}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg border hover:bg-slate-50 transition-base"
                            onClick={() => setModal({ mode: 'edit', id: p.id })}>Edit</button>
                    <button className="px-3 py-1.5 rounded-lg border text-red-600 hover:bg-red-50 transition-base"
                            onClick={() => { if (confirm('Delete this product?')) deleteM.mutate(p.id) }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {data?.items.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">No products</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <Pagination page={page} pageSize={pageSize} total={data?.totalCount ?? 0} onPage={setPage} />
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-4 shadow-xl border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">{modal.mode === 'create' ? 'New product' : 'Edit product'}</h3>
              <button className="text-slate-500 hover:text-slate-700 transition-base" onClick={() => setModal(null)}>✕</button>
            </div>
            <ProductForm
              mode={modal.mode}
              initial={modal.mode === 'edit' ? editing.data : undefined}
              onCancel={() => setModal(null)}
              onSubmit={(payload) => {
                if (modal.mode === 'create') {
                  createM.mutate(payload as any, { onSuccess: () => setModal(null) })
                } else if (modal.id) {
                  const { useUpdateProduct } = require('../hooks/useProducts')
                  const updateM = useUpdateProduct(modal.id)
                  updateM.mutate(payload as any, { onSuccess: () => setModal(null) })
                }
              }}
            />
          </div>
        </div>
      )}
    </Layout>
  )
}
