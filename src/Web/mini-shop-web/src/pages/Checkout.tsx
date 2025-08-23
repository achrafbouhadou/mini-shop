import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'
import { useProductsByIds } from '../hooks/useProducts'
import { createCheckoutSession } from '../lib/checkout'
import { useEffect, useMemo, useState } from 'react'

export default function Checkout() {
  const { items, clear } = useCart()
  const ids = Object.keys(items)
  const { data: products = [] } = useProductsByIds(ids)

  const rows = products.map(p => ({ ...p, qty: items[p.id] ?? 0, subtotal: p.price * (items[p.id] ?? 0) }))
  const total = rows.reduce((s, r) => s + r.subtotal, 0)

  // handle return from Stripe (?success=1 or ?canceled=1)
  const [msg, setMsg] = useState<string | null>(null)
  useEffect(() => {
    const q = new URLSearchParams(location.search)
    if (q.get('success')) { setMsg('Payment succeeded! Thank you.'); clear() }
    if (q.get('canceled')) setMsg('Payment canceled. You can try again.')
  }, [clear])

  return (
    <Layout>
      <div className="mb-2 text-sm text-slate-600">Cart → <span className="font-medium text-slate-900">Checkout</span> → Payment</div>
      <h1 className="text-2xl font-semibold mb-4 tracking-tight">Checkout</h1>

      {msg && <div className="mb-4 rounded-xl border bg-green-50 text-green-700 px-3 py-2">{msg}</div>}

      <div className="grid lg:grid-cols-[1fr,360px] gap-6">
        <div className="bg-white border rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Order items</h2>
          <ul className="divide-y">
            {rows.map(r => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.qty} × ${r.price.toFixed(2)}</div>
                </div>
                <div className="font-semibold">${r.subtotal.toFixed(2)}</div>
              </li>
            ))}
            {rows.length === 0 && <li className="py-3 text-slate-600">Your cart is empty.</li>}
          </ul>
        </div>

        <aside className="bg-white border rounded-2xl p-4 h-fit shadow-sm sticky top-20">
          <h2 className="font-semibold mb-3">Payment</h2>
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Items</span><span>{rows.length}</span>
          </div>
          <div className="flex justify-between text-base font-semibold mb-4">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <button
            disabled={rows.length === 0}
            onClick={async () => {
              const payload = Object.fromEntries(Object.entries(items).map(([k,v]) => [k, v]))
              const { url } = await createCheckoutSession(payload as Record<string, number>)
              window.location.href = url
            }}
            className="w-full h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-base shadow-sm"
          >
            Pay with Stripe
          </button>
          <p className="mt-2 text-[12px] text-slate-500">You will be redirected to a secure payment page.</p>
        </aside>
      </div>
    </Layout>
  )
}
