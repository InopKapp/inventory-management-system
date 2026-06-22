import { API_URL } from './config';
import { useNavigate } from 'react-router-dom';
import './ClientStoreFront.css';

function ClientSettings() {
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) return;

        try {
            const res = await fetch(`${API_URL}/api/users/self`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                alert("Your account has been deleted.");
                localStorage.clear();
                window.location.href = '/login';
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete account");
            }
        } catch (error) {
            alert("Error deleting account.");
        }
    };

    return (
        <div className="catalog-section centered-narrow-section">
            <h2>Account Settings</h2>
            <div className="item-card metrics-grid">
                <h3>Danger Zone</h3>
                <p className="category">Permanently delete your account login profile.</p>
                <button 
                    onClick={handleDeleteAccount} 
                    className="btn-danger-large"
                >
                    Delete My Account
                </button>
            </div>
        </div>
    );
}
export default ClientSettings;
