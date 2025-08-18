import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState<string>('checking...')

  useEffect(() => {
    fetch('/healthz')
      .then(r => r.json())
      .then(d => setStatus(d.status ?? 'unknown'))
      .catch(() => setStatus('offline'))
  }, [])

  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 24 }}>
      <h1>Mini Shop</h1>
      <p>API health: <strong>{status}</strong></p>
    </main>
  )
}

export default App
