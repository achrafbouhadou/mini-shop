export type PagedResult<T> = { items: T[]; page: number; pageSize: number; totalCount: number }

export type ProductSummaryDto = {
  id: string; name: string; sku: string; price: number; isActive: boolean
}

export type ProductDetailsDto = {
  id: string; name: string; sku: string; price: number; description?: string | null;
  categoryId: string; isActive: boolean
}

export type CreateProductRequest = {
  name: string; sku: string; price: number; description?: string | null; categoryId: string
}

export type UpdateProductRequest = {
  name: string; sku: string; price: number; description?: string | null; categoryId: string; isActive: boolean
}

export type CategoryOption = { id: string; name: string }
