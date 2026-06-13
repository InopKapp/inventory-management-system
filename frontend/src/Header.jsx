import './Header.css';

function Header() {
    return (
        <header className="navbar">
            <div className="navbar-brand">
                <span className="logo-icon">📦</span>
                <span className="logo-text">InventorySys</span>
            </div>

            <nav className="navbar-links">
                <a href="#dashboard" className="active">Dashboard</a>
                <a href="#items">Items</a>
                <a href="#settings">Settings</a>
            </nav>

            <div className="navbar-profile">
                <div className="avatar">A</div>
            </div>
        </header>
    );
}

export default Header;
