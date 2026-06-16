import { useState, useEffect } from 'react'
import './App.css'
import Header from './Header'
import InventoryTable from './InventoryTable'
import AddItemForm from './AddItemForm'

function App() {
  const [items, setItems] = useState([])

  //get (read)
  useEffect(() => {
    fetch('http://localhost:3001/api/items')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  //post (create)
  const addItem = async (newItem) => {
    try {
      const response = await fetch('http://localhost:3001/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      const savedItem = await response.json();

      setItems([...items, savedItem]);
    }
    catch (error) {
      console.error("Error adding items:", error);
    }
  };

  //delete
  const deleteItem = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/items/${id}`, {
        method: 'DELETE',
      });
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  //put (update)
  const editItem = async (id, updatedItem) => {
    try {
      await fetch(`http://localhost:3001/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      const updatedList = items.map((item) => (item.id === id ? updatedItem : item));
      setItems(updatedList);
    }
    catch (error) {
      console.error("Error editing item:", error);
    }
  }

  // const addItem = (newItem) => {
  //   const id = Date.now();
  //   const itemWithId = { ...newItem, id: id };
  //   setItems([...items, itemWithId]);
  // }
  // const deleteItem = (id) => {
  //   const updatedItems = items.filter((item) => item.id !== id);
  //   setItems(updatedItems);
  // }
  // const editItem = (id, updatedItem) => {
  //   const updatedList = items.map((item) => (item.id === id ? updatedItem : item));
  //   setItems(updatedList);
  // }
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
