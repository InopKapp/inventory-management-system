import { useState, useEffect } from 'react';
import './InventoryTable.css';

function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
        const intervalId = setInterval(() => fetchUsers(), 3000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/users', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                cache: 'no-store'
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleDeleteUser = async (id, username) => {
        if (!window.confirm(`Are you absolutely sure you want to delete the user: ${username}?`)) return;
        try {
            const res = await fetch(`http://localhost:3001/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                alert("User deleted.");
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (err) {
            alert("Error deleting user");
        }
    };

    return (
        <div className="history-section admin-history-section full-width-section">
            <h2>User Management</h2>
            <div className="table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Username</th><th>Role</th><th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>#{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.role}</td>
                                <td>
                                    <button
                                        className="btn-delete-user"
                                        onClick={() => handleDeleteUser(u.id, u.username)}
                                    >
                                        Delete User
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;
