const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const PORT = 3000;

// parse JSON bodies
app.use(express.json());

// Serve static files from directory
app.use(express.static(path.join(__dirname, 'GermanBliss', 'AddInventory')));

// Database initialize
const db = new sqlite3.Database('./data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database.');
    db.run(`CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        make TEXT,
        model TEXT,
        description TEXT,
        cost REAL,
        quantity INTEGER,
        status TEXT
    )`, err => {
        if (err) {
            console.error("Error creating table:", err.message);
            return;
        }
        console.log("Table created or already exists.");
    });
});

// Serve Index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'GermanBliss', 'AddInventory', 'Index.html'), err => {
        if (err) {
            console.error("Failed to send file:", err);
            res.status(500).send("An error occurred while trying to serve the file.");
        }
    });
});

// Define rout for adding inventory
app.post('/add-inventory', (req, res) => {
    const { make, model, description, cost, quantity, status } = req.body;
    const sql = `INSERT INTO inventory (make, model, description, cost, quantity, status) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [make, model, description, cost, quantity, status], function(err) {
        if (err) {
            console.error("Error adding item:", err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item added successfully', id: this.lastID });
    });
});

// Handle 404
app.use(function(req, res) {
    res.status(404).send("Sorry, can't find that!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
