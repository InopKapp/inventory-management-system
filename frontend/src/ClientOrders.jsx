import { useState, useEffect } from 'react';
import './ClientStoreFront.css';

function ClientOrders() {
    const [orders, setOrders] = useState([]);
    const clientUsername = localStorage.getItem('username');

    useEffect(() => {
        fetchMyOrders();

        const intervalId = setInterval(() => {
            fetchMyOrders();
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchMyOrders = async () => {
        const res = await fetch(`http://localhost:3001/api/orders?client=${clientUsername}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            cache: 'no-store'
        });
        const data = await res.json();
        setOrders(data);
    };

    return (
        <div className="history-section full-width-section">
            <h2>My Order History</h2>
            <div className="table-container">
                <table className="inventory-table">
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
    );
}
export default ClientOrders;
