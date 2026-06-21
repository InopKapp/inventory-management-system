import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const [isLightMode, setIsLightMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsLightMode(true);
            document.body.classList.add('light-mode');
        }
    }, []);

    const toggleTheme = () => {
        if (isLightMode) {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            setIsLightMode(false);
        } else {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            setIsLightMode(true);
        }
    };

    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };
    return (
        <header className="navbar">
            <div className="navbar-brand">
                <span className="logo-icon">📦</span>
                <span className="logo-text">InventorySys</span>
            </div>

            {token && (
                <nav className="navbar-links">
                    {role === 'admin' && (
                        <>
                            <Link to="/admin/inventory" className={location.pathname.includes('/inventory') ? 'active' : ''}>Inventory</Link>
                            <Link to="/admin/orders" className={location.pathname.includes('/orders') ? 'active' : ''}>Orders</Link>
                            <Link to="/admin/users" className={location.pathname.includes('/users') ? 'active' : ''}>Users</Link>
                            <Link to="/admin/analytics" className={location.pathname.includes('/analytics') ? 'active' : ''}>Analytics</Link>
                        </>
                    )}
                    {role === 'dealer' && (
                        <>
                            <Link to="/dealer/catalog" className={location.pathname.includes('/catalog') ? 'active' : ''}>Catalog</Link>
                            <Link to="/dealer/orders" className={location.pathname.includes('/orders') ? 'active' : ''}>Orders</Link>
                            <Link to="/dealer/performance" className={location.pathname.includes('/performance') ? 'active' : ''}>Performance</Link>
                        </>
                    )}
                    {role === 'client' && (
                        <>
                            <Link to="/client/store" className={location.pathname.includes('/store') ? 'active' : ''}>Store</Link>
                            <Link to="/client/orders" className={location.pathname.includes('/orders') ? 'active' : ''}>My Orders</Link>
                            <Link to="/client/settings" className={location.pathname.includes('/settings') ? 'active' : ''}>Settings</Link>
                        </>
                    )}
                </nav>
            )}

            <div className="navbar-profile">
                <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                    {isLightMode ? '🌙' : '☀️'}
                </button>
                {token && (
                    <>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
