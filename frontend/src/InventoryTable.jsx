import './InventoryTable.css';
import { useState } from 'react';

function InventoryTable({ inventoryData, onDeleteItem, onEditItem }) {
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', category: '', quantity: '', price: '' });
    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditFormData({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price: item.price
        });
    };
    const handleSaveClick = (id) => {
        const updatedItem = { ...editFormData, id: id };
        onEditItem(id, updatedItem);
        setEditingId(null);
    };
    return (
        <div className="table-container">
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>

                            {editingId === item.id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={editFormData.category}
                                            onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editFormData.quantity}
                                            onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editFormData.price}
                                            onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                        />
                                    </td>
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
                                        <button className="btn-delete" onClick={() => onDeleteItem(item.id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InventoryTable;
