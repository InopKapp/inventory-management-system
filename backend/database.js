const { createClient } = require('@libsql/client');
require('dotenv').config();

console.log("Connecting to Turso Cloud Database...");

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

// custom compatibility wrapper between local server.js file and turso cloud db
const db = {
    run: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        client.execute({ sql, args: params }).then(result => {
            // provide expected 'this.lastID' context for sqlite3 callbacks
            const context = { lastID: result.lastInsertRowid ? Number(result.lastInsertRowid) : 0 };
            if (callback) callback.call(context, null);
        }).catch(err => {
            if (callback) callback(err);
        });
    },
    get: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        client.execute({ sql, args: params }).then(result => {
            if (callback) callback(null, result.rows.length > 0 ? result.rows[0] : undefined);
        }).catch(err => {
            if (callback) callback(err);
        });
    },
    all: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        client.execute({ sql, args: params }).then(result => {
            if (callback) callback(null, result.rows);
        }).catch(err => {
            if (callback) callback(err);
        });
    }
};

module.exports = db;