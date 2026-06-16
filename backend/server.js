const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

//read
app.get('/api/items', (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

//create
app.post('/api/items', (req, res) => {
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
app.put('/api/items/:id', (req, res) => {
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
app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM items WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Item deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});