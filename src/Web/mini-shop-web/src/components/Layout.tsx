import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Store } from 'lucide-react'
import { ReactNode } from 'react'
import { useCart } from '../context/CartContext'

export default function Layout({ children, cartCount = 0 }: { children: ReactNode; cartCount?: number }) {
  const { count } = useCart()
  return (
    <>
      <header className="sticky top-0 z-10 bg-white/75 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900 hover:opacity-90 transition-base">
            <Store className="size-5" /> Mini Shop
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              className={({isActive}) =>
                isActive
                  ? 'text-slate-900 font-medium'
                  : 'text-slate-600 hover:text-slate-900 transition-base'}
            >Shop</NavLink>
            <NavLink
              to="/admin/products"
              className={({isActive}) =>
                isActive
                  ? 'text-slate-900 font-medium'
                  : 'text-slate-600 hover:text-slate-900 transition-base'}
            >Admin</NavLink>
            <Link to="/cart" className="relative">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 bg-blue-600 text-white text-[11px] px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="mt-16 border-t">
        <div className="mx-auto max-w-7xl px-4 text-xs text-slate-500 py-6">
          © {new Date().getFullYear()} Mini Shop · Built with React + Tailwind
        </div>
      </footer>
    </>
  )
}
