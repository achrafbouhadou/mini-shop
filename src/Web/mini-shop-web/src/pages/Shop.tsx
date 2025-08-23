import { useState } from 'react'
import Layout from '../components/Layout'
import { useProducts } from '../hooks/useProducts'
import { Plus } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { createCheckoutSession } from '../lib/checkout'

export default function Shop() {
  const [page, setPage] = useState(1)
  const { data, isFetching } = useProducts({ page, pageSize: 12, activeOnly: true })
  const [cart, setCart] = useState<Record<string, number>>({})
    // compute total (client-side) from loaded page items
    const totalCents = (data?.items ?? []).reduce((sum, p) => sum + (cart[p.id] ?? 0) * Math.round(p.price * 100), 0)
    const totalCount = Object.values(cart).reduce((a,b)=>a+b,0)
  const addToCart = (id: string) => setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }))

  return (
    <Layout cartCount={Object.values(cart).reduce((a,b)=>a+b,0)}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Featured Products</h1>
        <span className="text-sm text-slate-500">{isFetching ? 'Loading…' : `Total: ${data?.totalCount ?? 0}`}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(data?.items ?? []).map(p => (
            <ProductCard key={p.id} p={p} onAdd={addToCart} />
        ))}
    </div>
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(960px,92vw)]">
      <div className="bg-white/95 backdrop-blur border rounded-2xl shadow-xl p-4 flex items-center justify-between">
        <div className="text-sm text-slate-700">
          <strong>{totalCount}</strong> items · <strong>${(totalCents/100).toFixed(2)}</strong>
        </div>
        <button
          disabled={totalCount === 0}
          className="inline-flex items-center rounded-xl bg-blue-600 text-white text-sm px-4 py-2 disabled:opacity-50 hover:bg-blue-700 transition-base"
          onClick={async () => {
            const { url } = await createCheckoutSession(cart)
            window.location.href = url
          }}
        >
          Checkout
        </button>
      </div>
    </div>

      {/* Simple pager */}
      <div className="mt-8 flex justify-center">
        <button
          className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 transition-base"
          onClick={() => setPage(p => p + 1)}
          disabled={(data?.items?.length ?? 0) === 0}
        >
          Load more
        </button>
      </div>
    </Layout>
  )
}
