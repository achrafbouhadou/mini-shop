import { useState } from 'react'
import Layout from '../components/Layout'
import { useProducts } from '../hooks/useProducts'
import { Plus } from 'lucide-react'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const [page, setPage] = useState(1)
  const { data, isFetching } = useProducts({ page, pageSize: 12, activeOnly: true })
  const [cart, setCart] = useState<Record<string, number>>({})

  const addToCart = (id: string) => setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }))

  return (
    <Layout cartCount={Object.values(cart).reduce((a,b)=>a+b,0)}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Featured Products</h1>
        <span className="text-sm text-slate-500">{isFetching ? 'Loading…' : `Total: ${data?.totalCount ?? 0}`}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {(data?.items ?? []).map(p => (
            <ProductCard key={p.id} p={p} onAdd={addToCart} />
        ))}
    </div>

      {/* Simple pager */}
      <div className="mt-8 flex justify-center">
        <button
          className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50"
          onClick={() => setPage(p => p + 1)}
          disabled={(data?.items?.length ?? 0) === 0}
        >
          Load more
        </button>
      </div>
    </Layout>
  )
}
