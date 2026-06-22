import { useState, useEffect } from 'react';
import { API_URL } from './config';
import { socket } from './socket';
import './ClientStoreFront.css';
import './DealerDashboard.css';

function DealerCatalog() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchCatalog();
        socket.on('inventory_updated', fetchCatalog);
        return () => socket.off('inventory_updated', fetchCatalog);
    }, []);

    const fetchCatalog = async () => {
        const res = await fetch(`${API_URL}/api/items`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            cache: 'no-store'
        });
        const data = await res.json();
        setItems(data);
    };

    return (
        <div className="catalog-section full-width-section">
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
    );
}

export default DealerCatalog;
