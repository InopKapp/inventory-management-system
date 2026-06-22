import { useState, useEffect } from 'react';
import { socket } from './socket';
import './InventoryTable.css';
import './AddItemForm.css';

function AdminInventory() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', category: '', quantity: '', price: '' });

    useEffect(() => {
        fetchItems();
        socket.on('inventory_updated', fetchItems);
        return () => socket.off('inventory_updated', fetchItems);
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/items', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                cache: 'no-store'
            });
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleAddItemSubmit = async (event) => {
        event.preventDefault();
        const newItem = { name, category, quantity, price };
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
            setName('');
            setCategory('');
            setQuantity('');
            setPrice('');
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await fetch(`http://localhost:3001/api/items/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setItems(items.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditFormData({ name: item.name, category: item.category, quantity: item.quantity, price: item.price });
    };

    const handleSaveClick = async (id) => {
        const updatedItem = { ...editFormData, id };
        try {
            await fetch(`http://localhost:3001/api/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedItem),
            });
            setItems(items.map((item) => (item.id === id ? updatedItem : item)));
            setEditingId(null);
        } catch (error) {
            console.error("Error editing item:", error);
        }
    };

    return (
        <div className="full-width-section">
            <div className="form-container">
                <h2>Add New Item</h2>
                <form onSubmit={handleAddItemSubmit}>
                    <div className="input-group">
                        <label>Item Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="laptop" required />
                    </div>
                    <div className="input-group">
                        <label>Category</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="electronics" required />
                    </div>
                    <div className="input-group">
                        <label>Quantity</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" required />
                    </div>
                    <div className="input-group">
                        <label>Price</label>
                        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" required />
                    </div>
                    <button type="submit" className="btn-submit">Add Item</button>
                </form>
            </div>

            <div className="table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Item Name</th><th>Category</th><th>Quantity</th><th>Price</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                {editingId === item.id ? (
                                    <>
                                        <td><input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} /></td>
                                        <td><input type="text" value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })} /></td>
                                        <td><input type="number" value={editFormData.quantity} onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })} /></td>
                                        <td><input type="number" value={editFormData.price} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} /></td>
                                        <td>
                                            <button className="btn-edit" onClick={() => handleSaveClick(item.id)}>Save</button>
                                            <button className="btn-delete" onClick={() => setEditingId(null)}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price}</td>
                                        <td>
                                            <button className="btn-edit" onClick={() => handleEditClick(item)}>Edit</button>
                                            <button className="btn-delete" onClick={() => deleteItem(item.id)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminInventory;
