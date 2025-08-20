import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type {
  PagedResult, ProductSummaryDto, ProductDetailsDto,
  CreateProductRequest, UpdateProductRequest, CategoryOption
} from '../types/products'

export function useProducts(params: { page: number; pageSize: number; search?: string; sort?: string; activeOnly?: boolean }) {
  const { page, pageSize, search, sort, activeOnly } = params
  return useQuery({
    queryKey: ['products', page, pageSize, search ?? '', sort ?? '', activeOnly ?? false],
    queryFn: async () => {
      const r = await api.get<PagedResult<ProductSummaryDto>>('/api/products', { params: { page, pageSize, search, sort, activeOnly } })
      return r.data
    },
    keepPreviousData: true,
  })
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const r = await api.get<ProductDetailsDto>(`/api/products/${id}`)
      return r.data
    },
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const r = await api.get<CategoryOption[]>('/api/categories')
      return r.data
    }
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateProductRequest) => {
      const r = await api.post('/api/products', payload)
      return r.data as ProductDetailsDto
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }) }
  })
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateProductRequest) => {
      const r = await api.put(`/api/products/${id}`, payload)
      return r.data as ProductDetailsDto
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['product', id] })
    }
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/api/products/${id}`) },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }) }
  })
}
