const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "secret_inventory_key_123";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- JWT MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token." });
        req.user = user; // Attach the decrypted user payload to the request
        next();
    });
};

//read
app.get('/api/items', authenticateToken, (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

//create
app.post('/api/items', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Only admins can add items." });

    const { name, category, quantity, price } = req.body;

    db.run("INSERT INTO items (name,category,quantity,price) VALUES (?,?,?,?)", [name, category, quantity, price],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, name, category, quantity, price });
        }
    );
});

//update
app.put('/api/items/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Only admins can edit items." });

    const { id } = req.params;
    const { name, category, quantity, price } = req.body;

    db.run("UPDATE items SET name = ?,category = ?,quantity = ?,price = ? WHERE id = ?", [name, category, quantity, price, id],
        (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: "Item updated successfully" });
        }
    );
});

//delete
app.delete('/api/items/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Only admins can delete items." });

    const { id } = req.params;

    db.run("DELETE FROM items WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Item deleted successfully" });
    });
});

//--- AUTHENTICATION ENDPOINTS ---

//register
app.post('/api/register', async (req, res) => {
    const { username, password, role, dealer_id } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (username,password,role,dealer_id) VALUES (?,?,?,?)", [username, hashedPassword, role, dealer_id],
            function (err) {
                if (err) {
                    res.status(400).json({ error: "Username already exists or invalid data." });
                    return;
                }
                res.json({ message: "User registered successfully.", userID: this.lastID });
            }
        );
    }
    catch (error) {
        res.status(500).json({ error: "Server error during registration." });
    }
});

//login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username],
        async (err, user) => {
            if (err) {
                res.status(500).json({ error: "Server error." });
                return;
            }
            if (!user) {
                res.status(400).json({ error: "User not found!" });
                return;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ error: "Incorrect password." });
                return;
            }
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role, dealer_id: user.dealer_id },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.json({ message: "Login successful", token: token, role: user.role });
        }
    );
});

// ---ORDER ENDPOINTS ---

// place order (by clients)
app.post('/api/orders', authenticateToken, (req, res) => {
    if (req.user.role !== 'client') return res.status(403).json({ error: "Only clients can place orders." });

    const { item_id, item_name, dealer_username, quantity_ordered } = req.body;
    const client_username = req.user.username;
    const status = 'pending';
    db.run("INSERT INTO orders (item_id, item_name, client_username, dealer_username, quantity_ordered, status) VALUES (?,?,?,?,?,?)",
        [item_id, item_name, client_username, dealer_username, quantity_ordered, status],
        function (err) {
            if (err) {
                res.status(500).json({ error: "Failed to place order." });
                return;
            }
            res.json({ message: "Order placed successfully.", orderID: this.lastID });
        }
    )
});

// fetch orders (for dealers and for clients)
app.get('/api/orders', authenticateToken, (req, res) => {
    let query = "SELECT * FROM orders";
    let params = [];

    // BACKEND SECURE OVERRIDE
    if (req.user.role === 'dealer') {
        query += " WHERE dealer_username = ?";
        params.push(req.user.username);
    }
    else if (req.user.role === 'client') {
        query += " WHERE client_username = ?";
        params.push(req.user.username);
    }

    // if admin get everything
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch orders." });
            return;
        }
        res.json(rows);
    });
});

// approve/reject order (for dealers)
app.put('/api/orders/:id/status', authenticateToken, (req, res) => {
    if (req.user.role !== 'dealer') return res.status(403).json({ error: "Only dealers can approve/reject orders." });

    const { id } = req.params;
    const { status } = req.body;

    if (status === 'approved') {
        // fetch the order to see quantity
        db.get("SELECT item_id, quantity_ordered FROM orders WHERE id = ?", [id], (err, order) => {
            if (err || !order) return res.status(500).json({ error: "Order not found." });

            // check warehouse inventory
            db.get("SELECT quantity FROM items WHERE id = ?", [order.item_id], (err, item) => {
                if (err || !item) return res.status(500).json({ error: "Item not found in warehouse." });

                if (item.quantity < order.quantity_ordered) {
                    return res.status(400).json({ error: "Insufficient stock in warehouse to approve this order!" });
                }

                db.run("UPDATE items SET quantity = quantity - ? WHERE id = ?", [order.quantity_ordered, order.item_id], (err) => {
                    if (err) return res.status(500).json({ error: "Failed to deduct inventory." });

                    db.run("UPDATE orders SET status = 'approved' WHERE id = ?", [id], (err) => {
                        res.json({ message: "Order approved and inventory deducted." });
                    });
                });
            });
        });
    } else {
        db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id], function (err) {
            if (err) return res.status(500).json({ error: "Failed to update order status." });
            res.json({ message: `Order marked as ${status}` });
        });
    }
});

// fetch dealers (for client)
app.get('/api/dealers', authenticateToken, (req, res) => {
    db.all("SELECT username FROM users WHERE role = 'dealer'", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch dealers." });
            return;
        }
        res.json(rows);
    });
});

// delete self account (client)
app.delete('/api/users/self', authenticateToken, (req, res) => {
    const id = req.user.id;
    db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: "Failed to delete account." });
        res.json({ message: "Account deleted successfully." });
    });
});

// --- USER MANAGEMENT (for admin) ---

// fetch all users
app.get('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Only admins can view users." });

    db.all("SELECT id, username, role FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Failed to fetch users." });
        res.json(rows);
    });
});


// delete user
app.delete('/api/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Only admins can delete users." });

    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
        return res.status(400).json({ error: "You cannot delete your own active account!" });
    }

    db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: "Failed to delete user." });
        res.json({ message: "User deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});