import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

type State = { items: Record<string, number> } // productId -> qty
type Action =
  | { type: 'add'; id: string; qty?: number }
  | { type: 'set'; id: string; qty: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' }

function reducer(state: State, action: Action): State {
  const items = { ...state.items }
  switch (action.type) {
    case 'add': {
      const q = action.qty ?? 1
      items[action.id] = (items[action.id] ?? 0) + q
      if (items[action.id] <= 0) delete items[action.id]
      return { items }
    }
    case 'set': {
      if (action.qty <= 0) { delete items[action.id]; return { items } }
      items[action.id] = action.qty
      return { items }
    }
    case 'remove':
      delete items[action.id]; return { items }
    case 'clear':
      return { items: {} }
  }
}

type Ctx = State & {
  add: (id: string, qty?: number) => void
  set: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  count: number
}

const CartCtx = createContext<Ctx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      const raw = localStorage.getItem('cart:v1')
      return raw ? (JSON.parse(raw) as State) : { items: {} }
    } catch { return { items: {} } }
  })

  useEffect(() => {
    localStorage.setItem('cart:v1', JSON.stringify(state))
  }, [state])

  const count = useMemo(() => Object.values(state.items).reduce((a,b)=>a+b,0), [state.items])

  const value: Ctx = {
    ...state,
    add: (id, qty) => dispatch({ type: 'add', id, qty }),
    set: (id, qty) => dispatch({ type: 'set', id, qty }),
    remove: (id) => dispatch({ type: 'remove', id }),
    clear: () => dispatch({ type: 'clear' }),
    count
  }

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const v = useContext(CartCtx)
  if (!v) throw new Error('useCart must be used within CartProvider')
  return v
}
