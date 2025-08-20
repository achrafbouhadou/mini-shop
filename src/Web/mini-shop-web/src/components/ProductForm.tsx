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
        className="grid gap-3"
        >
        <label className="grid gap-1">
            <span className="text-sm text-slate-600">Name</span>
            <input className="h-10 rounded-xl border px-3 bg-white" {...register('name')} />
            {errors.name && <small className="text-red-600">{errors.name.message}</small>}
        </label>

        <label className="grid gap-1">
            <span className="text-sm text-slate-600">SKU</span>
            <input className="h-10 rounded-xl border px-3 bg-white" {...register('sku')} />
            {errors.sku && <small className="text-red-600">{errors.sku.message}</small>}
        </label>

        <label className="grid gap-1">
            <span className="text-sm text-slate-600">Price</span>
            <input type="number" step="0.01" className="h-10 rounded-xl border px-3 bg-white" {...register('price', { valueAsNumber: true })} />
            {errors.price && <small className="text-red-600">{errors.price.message}</small>}
        </label>

        <label className="grid gap-1">
            <span className="text-sm text-slate-600">Description</span>
            <textarea rows={3} className="rounded-xl border px-3 py-2 bg-white" {...register('description')} />
        </label>

        <label className="grid gap-1">
            <span className="text-sm text-slate-600">Category</span>
            <select className="h-10 rounded-xl border px-3 bg-white" {...register('categoryId')}>
            <option value="">— Select —</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <small className="text-red-600">{errors.categoryId.message}</small>}
        </label>

        {mode === 'edit' && (
            <label className="inline-flex items-center gap-2">
            <input type="checkbox" {...register('isActive')} defaultChecked />
            <span className="text-sm text-slate-700">Active</span>
            </label>
        )}

        <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="px-4 h-10 rounded-xl border bg-white hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-4 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700">{mode === 'create' ? 'Create' : 'Save'}</button>
        </div>
        </form>
    )
}
