import Layout from '../components/Layout'
import { useOrder } from '../hooks/useOrder'
import { CheckCircle, Clock } from 'lucide-react'
import { useEffect, useMemo } from 'react'

export default function ThankYou() {
  const params = new URLSearchParams(location.search)
  const orderId = params.get('orderId') ?? undefined
  const { data: order, isLoading, isError } = useOrder(orderId)

  const total = useMemo(() => (order?.items ?? [])
    .reduce((s, i) => s + i.subtotal, 0), [order])

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          {order?.status === 'Paid' ? (
            <div className="flex items-center gap-3 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <CheckCircle className="size-5" />
              <div>
                <h1 className="text-xl font-semibold">Thanks for your purchase!</h1>
                <p className="text-sm">Order <span className="font-mono">{order.orderNumber}</span> is confirmed.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Clock className="size-5" />
              <div>
                <h1 className="text-xl font-semibold">Payment processing…</h1>
                <p className="text-sm">We’re finalizing your order{order?.orderNumber ? <> <span className="font-mono">{order.orderNumber}</span></> : null}. This may take a few seconds.</p>
              </div>
            </div>
          )}
        </header>

        {isLoading && <div className="bg-white border rounded-2xl p-6">Loading order…</div>}
        {isError && <div className="bg-white border rounded-2xl p-6 text-red-600">Couldn’t load the order.</div>}

        {order && (
          <div className="grid lg:grid-cols-[1fr,280px] gap-6">
            <div className="bg-white border rounded-2xl p-4">
              <h2 className="font-semibold mb-3">Items</h2>
              <ul className="divide-y">
                {order.items.map((i) => (
                  <li key={i.productId} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{i.productName ?? 'Product'}</div>
                      <div className="text-xs text-slate-500">{i.quantity} × ${i.unitPrice.toFixed(2)} {order.currency.toUpperCase()}</div>
                    </div>
                    <div className="font-semibold">${i.subtotal.toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="bg-white border rounded-2xl p-4 h-fit">
              <h2 className="font-semibold mb-3">Summary</h2>
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Status</span><span className="font-medium">{order.status}</span>
              </div>
              <div className="flex justify-between text-base font-semibold mb-4">
                <span>Total</span>
                <span>${(total || order.amountTotalCents / 100).toFixed(2)} {order.currency.toUpperCase()}</span>
              </div>
              <a href="/" className="w-full inline-flex justify-center h-11 rounded-xl border bg-white hover:bg-slate-50">Continue shopping</a>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  )
}
