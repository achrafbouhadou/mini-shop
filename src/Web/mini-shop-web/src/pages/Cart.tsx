import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'
import { useProductsByIds } from '../hooks/useProducts'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart() {
  const nav = useNavigate()
  const { items, set, remove, clear } = useCart()
  const ids = Object.keys(items)
  const { data: products = [] } = useProductsByIds(ids)

  const rows = products.map(p => {
    const qty = items[p.id] ?? 0
    const subtotal = p.price * qty
    return { ...p, qty, subtotal }
  })
  const total = rows.reduce((s, r) => s + r.subtotal, 0)

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4 tracking-tight">Your Cart</h1>

      {rows.length === 0 ? (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <p className="text-slate-600">Your cart is empty.</p>
          <Link to="/" className="mt-3 inline-block text-blue-600 hover:underline">Continue shopping →</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr,360px] gap-6">
          <div className="overflow-x-auto border rounded-2xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Subtotal</th>
                  <th className="p-3 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t hover:bg-slate-50/60 transition-base">
                    <td className="p-3">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-slate-500 text-xs">{r.sku}</div>
                    </td>
                    <td className="p-3">${r.price.toFixed(2)}</td>
                    <td className="p-3">
                      <input
                        type="number" min={0} className="h-9 w-20 rounded-lg border px-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={r.qty}
                        onChange={e => set(r.id, Number(e.target.value))}
                      />
                    </td>
                    <td className="p-3">${r.subtotal.toFixed(2)}</td>
                    <td className="p-3">
                      <button className="px-3 py-1.5 rounded-lg border text-red-600 hover:bg-red-50 transition-base"
                              onClick={() => remove(r.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="bg-white border rounded-2xl p-4 h-fit shadow-sm sticky top-20">
            <h2 className="font-semibold mb-3">Order Summary</h2>
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Items</span><span>{rows.length}</span>
            </div>
            <div className="flex justify-between text-base font-semibold mb-4">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => nav('/checkout')}
              className="w-full h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-base shadow-sm">
              Proceed to checkout
            </button>
            <button
              onClick={() => clear()}
              className="w-full h-11 mt-2 rounded-xl border bg-white hover:bg-slate-50 transition-base">
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </Layout>
  )
}
