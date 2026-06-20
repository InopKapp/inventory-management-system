import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
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
                <>
                    <nav className="navbar-links">
                        <a href="#dashboard" className="active">Dashboard</a>
                        <a href="#items">Items</a>
                        <a href="#settings">Settings</a>
                    </nav>

                    <div className="navbar-profile">
                        <div className="avatar">A</div>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </>
            )}
        </header>
    );
}

export default Header;
