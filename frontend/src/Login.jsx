import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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


    const handleLogin = async (e) => {
        e.preventDefault();

        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', username);

            if (data.role === 'admin') {
                navigate('/admin');
            }
            else if (data.role === 'dealer') {
                navigate('/dealer');
            }
            else {
                navigate('/client');
            }
        }
        catch (err) {
            setError("Cannot connect to the server");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <form className="login-form" onSubmit={handleLogin}>
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
                    <button type="submit" className="login-btn">Sign In</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-primary)' }}>
                    Don't have an account? <span
                        style={{ color: 'var(--accent-color)', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate('/register')}
                    >
                        Sign Up here
                    </span>
                </p>

            </div>
        </div>
    );
}

export default Login;