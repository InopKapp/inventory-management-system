import { Outlet } from 'react-router-dom';
import './DealerDashboard.css';

function DealerDashboard() {
    const dealerUsername = localStorage.getItem('username');

    return (
        <div className="storefront-container">
            <h1 className="welcome-text">Dealer Dashboard ({dealerUsername})</h1>
            <Outlet />
        </div>
    );
}

export default DealerDashboard;
