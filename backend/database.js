const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    }
    else {
        console.log("Connected to the SQLite databse.");

        db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Error creating table:", err.message);
            }
            else {
                console.log("Items table ready.");
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            dealer_id INTEGER
        )`, (err) => {
            if (err) {
                console.error("Error creating users table:", err.message);
            }
            else {
                console.log("Users table ready.");
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER NOT NULL,
            item_name TEXT NOT NULL,
            client_username TEXT NOT NULL,
            dealer_username TEXT NOT NULL,
            quantity_ordered INTEGER NOT NULL,
            status TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Error creating orders table:", err.message);
            }
            else {
                console.log("Orders table ready.");
            }
        });
    }
});

module.exports = db;