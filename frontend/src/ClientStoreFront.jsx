import { useState, useEffect } from 'react';
import './ClientStoreFront.css';

function ClientStorefront() {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);

    const clientUsername = localStorage.getItem('username');

    useEffect(() => {
        fetchCatalog();
        fetchMyOrders();
    }, []);

    const fetchCatalog = async () => {
        const res = await fetch('http://localhost:3001/api/items', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setItems(data);
    }

    const fetchMyOrders = async () => {
        const res = await fetch(`http://localhost:3001/api/orders?client=${clientUsername}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setOrders(data);
    };

    const handlePlaceOrder = async (itemId, itemName) => {
        const dealerName = window.prompt("Enter the username of the Dealer you want to send this to:");
        if (!dealerName) return;
        const qty = window.prompt(`How many ${itemName} do you want to order?`);
        if (!qty || isNaN(qty)) return;

        try {
            await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    item_id: itemId,
                    item_name: itemName,
                    client_username: clientUsername,
                    dealer_username: dealerName,
                    quantity_ordered: parseInt(qty)
                })
            });
            alert("Order Placed Successfully.");
            fetchMyOrders();
        }
        catch (err) {
            alert("Error placing order.");
        }
    };

    return (
        <div className="storefront-container">
            <h1 className="welcome-text">Welcome, {clientUsername}</h1>

            <div className="storefront-sections">
                <div className="catalog-section">
                    <h2>Master Catalog</h2>
                    <div className="card-grid">
                        {items.map(item => (
                            <div key={item.id} className="item-card">
                                <h3>{item.name}</h3>
                                <p className="category">{item.category}</p>
                                <p className="price">${item.price}</p>
                                <p className="stock">Available: {item.quantity}</p>
                                <button onClick={() => handlePlaceOrder(item.id, item.name)} className="order-btn">
                                    Place Order
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="history-section">
                    <h2>My Order History</h2>
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Sent To Dealer</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.item_name}</td>
                                    <td>{order.quantity_ordered}</td>
                                    <td>{order.dealer_username}</td>
                                    <td>
                                        <span className={`status-badge ${order.status}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default ClientStorefront;