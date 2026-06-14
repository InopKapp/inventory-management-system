import { useState } from 'react';
import './AddItemForm.css';

function AddItemForm({ onAddItem }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("User submitted:", name, category, quantity, price);
        const newItem = {
            name: name,
            category: category,
            quantity: quantity,
            price: price
        };
        onAddItem(newItem);
        setName('');
        setCategory('');
        setQuantity('');
        setPrice('');
    };

    return (
        <div className="form-container">
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Item Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="laptop"
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="electronics"
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Price</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                </div>

                <button type="submit" className="btn-submit">Add Item</button>
            </form>
        </div>
    );
}

export default AddItemForm