import { useState, useEffect } from 'react';
import './InventoryTable.css';

function AdminAnalytics() {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const ordersRes = await fetch('http://localhost:3001/api/orders', { headers: { 'Authorization': `Bearer ${token}` } });
            const ordersData = await ordersRes.json();
            setOrders(ordersData);

            const usersRes = await fetch('http://localhost:3001/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
            const usersData = await usersRes.json();
            setUsers(usersData);
        };
        fetchData();
    }, []);

    const totalOrders = orders.length;
    const totalUsers = users.length;
    const dealersCount = users.filter(u => u.role === 'dealer').length;
    const clientsCount = users.filter(u => u.role === 'client').length;

    return (
        <div className="centered-medium-section">
            <h2>System Analytics</h2>
            <div className="card-grid metrics-grid">
                <div className="item-card metric-card">
                    <h3 className="metric-value metric-accent">{totalOrders}</h3>
                    <p className="category">Total Orders Placed</p>
                </div>
                <div className="item-card metric-card">
                    <h3 className="metric-value metric-success">{totalUsers}</h3>
                    <p className="category">Total Registered Users</p>
                </div>
                <div className="item-card metric-card">
                    <h3 className="metric-value metric-purple">{dealersCount}</h3>
                    <p className="category">Active Dealers</p>
                </div>
                <div className="item-card metric-card">
                    <h3 className="metric-value metric-warning">{clientsCount}</h3>
                    <p className="category">Active Clients</p>
                </div>
            </div>
        </div>
    );
}

export default AdminAnalytics;
