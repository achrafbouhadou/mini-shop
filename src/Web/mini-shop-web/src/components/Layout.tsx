import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Store } from 'lucide-react'
import { ReactNode } from 'react'

export default function Layout({ children, cartCount = 0 }: { children: ReactNode; cartCount?: number }) {
  return (
    <>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <Store className="size-5" /> Mini Shop
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/" className={({isActive}) => isActive ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}>Shop</NavLink>
            <NavLink to="/admin/products" className={({isActive}) => isActive ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}>Admin</NavLink>
            <div className="relative">
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 bg-blue-600 text-white text-[11px] px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="container py-6">{children}</main>
      <footer className="mt-16 border-t">
        <div className="container text-xs text-slate-500 py-6">© {new Date().getFullYear()} Mini Shop</div>
      </footer>
    </>
  )
}
