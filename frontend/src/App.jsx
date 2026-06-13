import { useState } from 'react'
import './App.css'
import Header from './Header'
import InventoryTable from './InventoryTable'

function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Laptop Pro 15"', category: 'Electronics', quantity: 45, price: 1299.00 },
    { id: 2, name: 'Mechanical Keyboard', category: 'Accessories', quantity: 120, price: 89.99 },
    { id: 3, name: 'Gaming Mouse', category: 'Accessories', quantity: 100, price: 49.99 },
    { id: 4, name: 'Mousepad', category: 'Accessories', quantity: 145, price: 19.99 }
  ])
  return (
    <>
      <Header />
      <div className="app-container">
        <h1>Inventory Management System</h1>
        <p>App will go here</p>
        <InventoryTable inventoryData={items} />
      </div>
    </>
  )
}

export default App
