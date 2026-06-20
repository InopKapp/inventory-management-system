import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import ClientStorefront from './ClientStoreFront';
import DealerDashboard from './DealerDashboard';
import AllOrdersTable from './AllOrdersTable';
import './App.css'
import Header from './Header'
import InventoryTable from './InventoryTable'
import AddItemForm from './AddItemForm'

function App() {
  const [items, setItems] = useState([])

  //get (read)
  useEffect(() => {
    fetch('http://localhost:3001/api/items', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  //post (create)
  const addItem = async (newItem) => {
    try {
      const response = await fetch('http://localhost:3001/api/items', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedItem),
      });

      const updatedList = items.map((item) => (item.id === id ? updatedItem : item));
      setItems(updatedList);
    }
    catch (error) {
      console.error("Error editing item:", error);
    }
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <div className="app-container">
              <h1>Inventory Management System</h1>
              <AddItemForm onAddItem={addItem} />
              <InventoryTable inventoryData={items}
                onDeleteItem={deleteItem}
                onEditItem={editItem}
              />
              <AllOrdersTable />
            </div>
          </ProtectedRoute>
        } />
        <Route path="/client" element={
          <ProtectedRoute requiredRole="client">
            <ClientStorefront />
          </ProtectedRoute>
        } />
        <Route path="/dealer" element={
          <ProtectedRoute requiredRole="dealer">
            <DealerDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
