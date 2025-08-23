import { Routes, Route } from 'react-router-dom'
import Shop from './pages/Shop'
import AdminProducts from './pages/AdminProducts'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ThankYou from './pages/ThankYou'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shop />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  )
}
