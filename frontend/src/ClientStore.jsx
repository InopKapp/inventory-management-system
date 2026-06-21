import { useState, useEffect } from 'react';
import './ClientStoreFront.css';

function ClientStore() {
    const [items, setItems] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedDealer, setSelectedDealer] = useState('');

    const clientUsername = localStorage.getItem('username');

    useEffect(() => {
        fetchCatalog();
        fetchDealers();

        const intervalId = setInterval(() => {
            fetchCatalog();
            fetchDealers();
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchDealers = async () => {
        const res = await fetch('http://localhost:3001/api/dealers', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            cache: 'no-store'
        });
        const data = await res.json();
        setDealers(data);
    }

    const fetchCatalog = async () => {
        const res = await fetch('http://localhost:3001/api/items', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            cache: 'no-store'
        });
        const data = await res.json();
        setItems(data);
    }

    const handleAddToCart = (itemId, itemName) => {
        if (!selectedDealer) {
            alert("Please select a Dealer from the dropdown at the top first!");
            return;
        }
        const qty = window.prompt(`How many ${itemName} do you want to add to your cart?`);
        if (!qty || isNaN(qty)) return;

        const existingItem = cart.find(item => item.item_id === itemId);
        if (existingItem) {
            setCart(cart.map(item =>
                item.item_id === itemId
                    ? { ...item, quantity_ordered: item.quantity_ordered + parseInt(qty) }
                    : item
            ));
        } else {
            setCart([...cart, {
                item_id: itemId,
                item_name: itemName,
                quantity_ordered: parseInt(qty)
            }]);
        }
    };

    const handleRemoveFromCart = (itemId) => {
        setCart(cart.filter(item => item.item_id !== itemId));
    };

    const handleCheckout = async () => {
        if (!selectedDealer) {
            alert("Please select a dealer from the dropdown first.");
            return;
        }
        try {
            await Promise.all(cart.map(cartItem =>
                fetch('http://localhost:3001/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        item_id: cartItem.item_id,
                        item_name: cartItem.item_name,
                        client_username: clientUsername,
                        dealer_username: selectedDealer,
                        quantity_ordered: cartItem.quantity_ordered
                    })
                })
            ));
            alert("Checkout complete! Orders sent to your Dealer.");
            setCart([]);
        } catch (err) {
            alert("Error during checkout.");
        }
    };

    return (
        <div className="catalog-section full-width-section">
            <div className="dealer-select-container">
                {cart.length > 0 && (
                    <div className="cart-container">
                        <h2 className="cart-title">Your Cart</h2>

                        <ul className="cart-list">
                            {cart.map((c) => (
                                <li key={c.item_id} className="cart-item">
                                    <span className="cart-item-text">{c.quantity_ordered}x {c.item_name}</span>
                                    <button
                                        onClick={() => handleRemoveFromCart(c.item_id)}
                                        className="btn-remove-cart"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleCheckout}
                            className="btn-checkout"
                        >
                            Checkout All Items
                        </button>
                    </div>
                )}
                <label className="dealer-label">Select Your Assigned Dealer:</label>
                <select
                    value={selectedDealer}
                    onChange={(e) => setSelectedDealer(e.target.value)}
                    className="dealer-select"
                >
                    <option value="">-- Choose a Dealer --</option>
                    {dealers.map(d => (
                        <option key={d.username} value={d.username}>{d.username}</option>
                    ))}
                </select>
            </div>
            
            <h2>Master Catalog</h2>
            <div className="card-grid">
                {items.map(item => (
                    <div key={item.id} className="item-card">
                        <h3>{item.name}</h3>
                        <p className="category">{item.category}</p>
                        <p className="price">${item.price}</p>
                        <p className="stock">Available: {item.quantity}</p>
                        <button onClick={() => handleAddToCart(item.id, item.name)} className="order-btn">
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ClientStore;
