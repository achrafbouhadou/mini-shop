import { Routes, Route } from 'react-router-dom'
import Shop from './pages/Shop'
import AdminProducts from './pages/AdminProducts'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Shop />} />
      <Route path="/admin/products" element={<AdminProducts />} />
    </Routes>
  )
}
