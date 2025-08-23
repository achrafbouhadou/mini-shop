import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export type OrderItemRow = {
  productId: string
  productName: string | null
  sku: string | null
  unitPrice: number
  quantity: number
  subtotal: number
}

export type OrderSummary = {
  id: string
  orderNumber: string
  status: 'Pending' | 'Paid' | 'Cancelled' | string
  currency: string
  amountTotalCents: number
  items: OrderItemRow[]
}

export function useOrder(id?: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get<OrderSummary>(`/api/orders/${id}`)
      return data
    },
    enabled: !!id,
    refetchInterval: (q) => {
      const status = (q.state.data as OrderSummary | undefined)?.status
      return status === 'Pending' ? 2000 : false
    }
  })
}
