const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./wedding_guestbook.db');

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS guests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            address TEXT,
            phone TEXT,
            note TEXT
        )`
    );
});

module.exports = db;

