document.getElementById('addInventoryForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent submitting the default way

    const formData = {
        make: document.getElementById('make').value,
        model: document.getElementById('model').value,
        description: document.getElementById('description').value,
        cost: parseFloat(document.getElementById('cost').value),
        quantity: parseInt(document.getElementById('quantity').value),
        status: document.getElementById('status').value
    };

    fetch('/add-inventory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Inventory Added Successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to add item');
    });


    db.serialize(() => {
        db.run("DROP TABLE IF EXISTS inventory", (err) => {
            if (err) console.error("Error dropping table:", err.message);
            else console.log("Table dropped successfully.");
        });
    
        db.run(`CREATE TABLE inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            make TEXT,
            model TEXT,
            description TEXT,
            cost REAL,
            quantity INTEGER,
            status TEXT
        )`, (err) => {
            if (err) console.error("Error creating table:", err.message);
            else console.log("Table created successfully with 'status' column.");
        });
    });
    
});
