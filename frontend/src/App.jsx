import { useState } from 'react'
import './App.css'
import Header from './Header'
import InventoryTable from './InventoryTable'
import AddItemForm from './AddItemForm'

function App() {
  const [items, setItems] = useState([
    { id: Date.now(), name: 'Laptop Pro 15"', category: 'Electronics', quantity: 45, price: 1299.00 },
    { id: Date.now() + 1, name: 'Mechanical Keyboard', category: 'Accessories', quantity: 120, price: 89.99 },
  ])
  const addItem = (newItem) => {
    const id = Date.now();
    const itemWithId = { ...newItem, id: id };
    setItems([...items, itemWithId]);
  }
  const deleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  }
  const editItem = (id, updatedItem) => {
    const updatedList = items.map((item) => (item.id === id ? updatedItem : item));
    setItems(updatedList);
  }
  return (
    <>
      <Header />
      <div className="app-container">
        <h1>Inventory Management System</h1>
        <AddItemForm onAddItem={addItem} />
        <InventoryTable inventoryData={items}
          onDeleteItem={deleteItem}
          onEditItem={editItem}
        />
      </div>
    </>
  )
}

export default App
