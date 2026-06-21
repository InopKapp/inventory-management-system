import { Outlet } from 'react-router-dom';
import './ClientStoreFront.css';

function ClientStorefront() {
    const clientUsername = localStorage.getItem('username');

    return (
        <div className="storefront-container">
            <h1 className="welcome-text">Welcome, {clientUsername}</h1>
            <Outlet />
        </div>
    );
}
export default ClientStorefront;