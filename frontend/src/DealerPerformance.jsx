import { useState, useEffect } from 'react';
import './ClientStoreFront.css';
import './DealerDashboard.css';

function DealerPerformance() {
    const [orders, setOrders] = useState([]);
    const dealerUsername = localStorage.getItem('username');

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await fetch(`http://localhost:3001/api/orders?dealer=${dealerUsername}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                cache: 'no-store'
            });
            const data = await res.json();
            setOrders(data);
        };
        fetchOrders();
    }, [dealerUsername]);

    const approvedCount = orders.filter(o => o.status === 'approved').length;
    const rejectedCount = orders.filter(o => o.status === 'rejected').length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const totalCount = orders.length;

    return (
        <div className="catalog-section centered-medium-section">
            <h2>Dealer Performance Metrics</h2>
            <div className="card-grid metrics-grid">
                <div className="item-card metric-card">
                    <h3 className="metric-value metric-accent">{totalCount}</h3>
                    <p className="category">Total Orders Processed</p>
                </div>
                <div className="item-card metric-card">
                    <h3 className="metric-value metric-success">{approvedCount}</h3>
                    <p className="category">Approved Orders</p>
                </div>
                <div className="item-card metric-card">
                    <h3 className="metric-value metric-danger">{rejectedCount}</h3>
                    <p className="category">Rejected Orders</p>
                </div>
                <div className="item-card metric-card">
                    <h3 className="metric-value metric-warning">{pendingCount}</h3>
                    <p className="category">Pending Action</p>
                </div>
            </div>
        </div>
    );
}

export default DealerPerformance;
