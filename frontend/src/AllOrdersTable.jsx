import { useState, useEffect } from 'react';
import './ClientStoreFront.css';

function AllOrdersTable() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/orders', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error("Error fetching all orders:", err);
        }
    };

    return (
        <div className="history-section" style={{ marginTop: '60px' }}>
            <h2>Global Order Ledger (Admin View)</h2>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Client</th>
                        <th>Dealer</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.item_name}</td>
                            <td>{order.quantity_ordered}</td>
                            <td>{order.client_username}</td>
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
    );
}

export default AllOrdersTable;
