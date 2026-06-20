import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // if no token at all throw to login screen
    if (!token) {
        return <Navigate to="/login" />;
    }

    // if a specific role is required to view this screen but it is not present kick back to correct dashboard
    if (requiredRole && userRole !== requiredRole) {
        if (userRole === 'admin') return <Navigate to="/admin" />;
        if (userRole === 'dealer') return <Navigate to="/dealer" />;
        if (userRole === 'client') return <Navigate to="/client" />;

        // if role is corrupted, kicks back to login
        return <Navigate to="/login" />
    }

    // if all the security checks are passed, show the screen
    return children;
}

export default ProtectedRoute;
