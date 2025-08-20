import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { ProductSummaryDto } from '../types/products'
import { productPlaceholder, fallbackPlaceholder } from '../lib/img'

export default function ProductCard({
  p,
  onAdd
}: {
  p: ProductSummaryDto
  onAdd: (id: string) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [src, setSrc] = useState(productPlaceholder(p.id))

  return (
    <article className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="relative">
        {!loaded && <div className="aspect-[4/3] bg-slate-200 animate-pulse" />}
        <img
          src={src}
          alt={p.name}
          className={`w-full aspect-[4/3] object-cover ${loaded ? 'block' : 'hidden'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setSrc(fallbackPlaceholder(640, 480, p.name))}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="p-4">
        <h3 className="font-medium text-slate-900 line-clamp-1">{p.name}</h3>
        <p className="text-sm text-slate-500 mb-3">{p.sku}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">${p.price.toFixed(2)}</span>
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white text-sm px-3 py-2 hover:bg-blue-700 active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => onAdd(p.id)}
          >
            <Plus className="size-4" /> Add
          </button>
        </div>
      </div>
    </article>
  )
}
