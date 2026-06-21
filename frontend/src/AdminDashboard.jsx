import { Outlet } from 'react-router-dom';

function AdminDashboard() {
    return (
        <div className="app-container">
            <h1>Inventory Management System</h1>
            <h2>Admin View</h2>
            <Outlet />
        </div>
    );
}

export default AdminDashboard;
