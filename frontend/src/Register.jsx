import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    // if logged in, throw back to the respective dashboard
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token) {
            if (role === 'admin') navigate('/admin');
            else if (role === 'dealer') navigate('/dealer');
            else navigate('/client');
        }
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role, dealer_id: null }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            setSuccess("Account created! Redirecting to login...");

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError("Cannot connect to server.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Create Account</h2>

                <form className="login-form" onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Account Type</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="register-select"
                        >
                            <option value="admin">Admin</option>
                            <option value="dealer">Dealer</option>
                            <option value="client">Client</option>
                        </select>
                    </div>

                    <button type="submit" className="login-btn">Register</button>
                </form>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <p className="auth-link-text">
                    Already have an account? <span
                        className="auth-link"
                        onClick={() => navigate('/login')}
                    >
                        Sign In here
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;
