import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { CategoryOption, CreateProductRequest, UpdateProductRequest, ProductDetailsDto } from '../types/products'
import { useCategories } from '../hooks/useProducts'

const schema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().min(1).max(64),
  price: z.number().min(0),
  description: z.string().max(2000).optional().nullable(),
  categoryId: z.string().uuid(),
  isActive: z.boolean().optional() // only for update
})

type FormValues = z.infer<typeof schema>

export default function ProductForm({
  mode, initial, onSubmit, onCancel
}: {
  mode: 'create' | 'edit',
  initial?: ProductDetailsDto,
  onSubmit: (values: CreateProductRequest | UpdateProductRequest) => void,
  onCancel: () => void
}) {
  const { data: categories } = useCategories()

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ? {
      name: initial.name,
      sku: initial.sku,
      price: initial.price,
      description: initial.description ?? undefined,
      categoryId: initial.categoryId,
      isActive: initial.isActive
    } : { price: 0, isActive: true } as any
  })

  useEffect(() => { if (initial) reset(undefined, { keepDefaultValues: false }) }, [initial, reset])

  return (
    <form
      onSubmit={handleSubmit(v => onSubmit(mode === 'create'
        ? { name: v.name, sku: v.sku, price: v.price, description: v.description, categoryId: v.categoryId }
        : { name: v.name, sku: v.sku, price: v.price, description: v.description, categoryId: v.categoryId, isActive: v.isActive ?? true }))}
      style={{ display: 'grid', gap: 12, minWidth: 360 }}
    >
      <label> Name
        <input {...register('name')} />
        {errors.name && <small style={{ color: 'red' }}>{errors.name.message}</small>}
      </label>

      <label> SKU
        <input {...register('sku')} />
        {errors.sku && <small style={{ color: 'red' }}>{errors.sku.message}</small>}
      </label>

      <label> Price
        <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
        {errors.price && <small style={{ color: 'red' }}>{errors.price.message}</small>}
      </label>

      <label> Description
        <textarea rows={3} {...register('description')} />
      </label>

      <label> Category
        <select {...register('categoryId')}>
          <option value="">— Select —</option>
          {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.categoryId && <small style={{ color: 'red' }}>{errors.categoryId.message}</small>}
      </label>

      {mode === 'edit' && (
        <label>
          <input type="checkbox" {...register('isActive')} defaultChecked />
          {' '}Active
        </label>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">{mode === 'create' ? 'Create' : 'Save'}</button>
      </div>
    </form>
  )
}
