import { api } from './api'
export async function createCheckoutSession(cart: Record<string, number>) {
  const items = Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity }))
  const { data } = await api.post<{ url: string; orderId: string }>('/api/checkout/session', items)
  return data
}
