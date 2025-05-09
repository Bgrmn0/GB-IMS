const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const PORT = 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static files from the GermanBliss folder
app.use(express.static(path.join(__dirname, 'GermanBliss')));

// Connect to SQLite database
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

// Serve homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'GermanBliss', 'AddInventory', 'Index.html'));
});

// Add inventory
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

// View all inventory
app.get('/inventory', (req, res) => {
    const sql = "SELECT * FROM inventory";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error retrieving inventory:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get single inventory item by ID
app.get('/inventory/:id', (req, res) => {
    const id = req.params.id;
    console.log("Requested inventory ID:", id);
    db.get("SELECT * FROM inventory WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error("Error retrieving item:", err.message);
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: "Item not found" });
        } else {
            res.json(row);
        }
    });
});

// Update existing inventory item
app.put('/update-inventory/:id', (req, res) => {
    const id = req.params.id;
    const { make, model, description, cost, quantity, status } = req.body;

    const sql = `UPDATE inventory SET make = ?, model = ?, description = ?, cost = ?, quantity = ?, status = ? WHERE id = ?`;
    db.run(sql, [make, model, description, cost, quantity, status, id], function(err) {
        if (err) {
            console.error("Error updating item:", err.message);
            res.status(500).json({ error: err.message });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.json({ message: 'Item updated successfully' });
        }
    });
});

// Search inventory
app.get('/search-inventory', (req, res) => {
    const { query } = req.query;
    const sql = `SELECT * FROM inventory WHERE make LIKE ? OR model LIKE ? OR description LIKE ?`;
    const wildcard = `%${query}%`;
    db.all(sql, [wildcard, wildcard, wildcard], (err, rows) => {
        if (err) {
            console.error("Error searching inventory:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// 404 fallback
app.use((req, res) => {
    res.status(404).send("Sorry, can't find that!!!!!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
