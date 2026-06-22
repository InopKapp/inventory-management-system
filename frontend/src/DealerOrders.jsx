import { useState, useEffect } from 'react';
import { API_URL } from './config';
import { socket } from './socket';
import './InventoryTable.css';
import './DealerDashboard.css';

function DealerOrders() {
    const [orders, setOrders] = useState([]);
    const dealerUsername = localStorage.getItem('username');

    useEffect(() => {
        fetchPendingOrders();
        socket.on('orders_updated', fetchPendingOrders);
        return () => socket.off('orders_updated', fetchPendingOrders);
    }, []);

    const fetchPendingOrders = async () => {
        const res = await fetch(`${API_URL}/api/orders?dealer=${dealerUsername}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            cache: 'no-store'
        });
        const data = await res.json();
        setOrders(data);
    };

    const handleAction = async (orderId, action) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: action })
            });
            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.error || "Failed to process order.");
                return;
            }
            fetchPendingOrders();
        } catch (err) {
            alert("Error updating order.");
        }
    };

    return (
        <div className="history-section full-width-section">
            <h2>Orders Pending Approval</h2>
            <div className="table-container">
                <table className="inventory-table">
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

export default DealerOrders;
