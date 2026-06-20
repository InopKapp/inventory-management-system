import { useState, useEffect } from 'react';
import './ClientStoreFront.css';
import './DealerDashboard.css';

function DealerDashboard() {
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const dealerUsername = localStorage.getItem('username');

    useEffect(() => {
        fetchPendingOrders();
        fetchCatalog();
    }, []);

    const fetchPendingOrders = async () => {
        const res = await fetch(`http://localhost:3001/api/orders?dealer=${dealerUsername}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setOrders(data);
    };

    const fetchCatalog = async () => {
        const res = await fetch('http://localhost:3001/api/items', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setItems(data);
    };

    const handleAction = async (orderId, action) => {
        try {
            await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: action })
            });
            fetchPendingOrders();
        } catch (err) {
            alert("Error updating order.");
        }
    };

    return (
        <div className="storefront-container">
            <h1 className="welcome-text">Dealer Dashboard ({dealerUsername})</h1>

            <div className="catalog-section">
                <h2>Master Catalog (Read-Only)</h2>
                <div className="card-grid">
                    {items.map(item => (
                        <div key={item.id} className="item-card">
                            <h3>{item.name}</h3>
                            <p className="category">{item.category}</p>
                            <p className="price">${item.price}</p>
                            <p className="stock">Available: {item.quantity}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="history-section">
                <h2>Orders Pending Approval</h2>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Item Name</th>
                            <th>Qty Requested</th>
                            <th>Client Username</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.item_name}</td>
                                <td>{order.quantity_ordered}</td>
                                <td>{order.client_username}</td>
                                <td>
                                    <span className={`status-badge ${order.status}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    {order.status === 'pending' && (
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => handleAction(order.id, 'approved')}
                                                className="approve-btn"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(order.id, 'rejected')}
                                                className="reject-btn"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DealerDashboard;
