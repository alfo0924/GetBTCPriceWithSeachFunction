const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create database connection
const dbPath = path.resolve(__dirname, 'C:\\Users\\user\\WebstormProjects\\GetBTCPriceWithSeachFunction\\db', 'sqlite.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database');
        createTable();
        insertData();
    }
});

// Function to create btc_prices table
const createTable = () => {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS btc_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL,
            close DECIMAL(10, 2) NOT NULL,
            volume BIGINT NOT NULL
        )
    `;
    db.run(createTableSQL, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created successfully');
        }
    });
};

// Function to insert data into btc_prices table
const insertData = () => {
    const insertSQL = `
        INSERT INTO btc_prices (date, close, volume) VALUES
                                                         ('2024-05-25', 68536.88, 28293212160),
                                                         ('2024-05-23', 67929.56, 41895680979),
                                                         ('2024-05-22', 69122.34, 32802561717),
                                                         ('2024-05-21', 70136.53, 46932005990),
                                                         ('2024-05-20', 71448.20, 43850655717)
    `;
    db.run(insertSQL, (err) => {
        if (err) {
            console.error('Error inserting data:', err.message);
        } else {
            console.log('Data inserted successfully');
        }
    });
};

// Search endpoint for filtering data between dates
app.get('/search', (req, res) => {
    const { startDate, endDate } = req.query;

    // Query database for data between startDate and endDate
    const query = `SELECT * FROM btc_prices WHERE date BETWEEN ? AND ?`;
    db.all(query, [startDate, endDate], (err, rows) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});

// Endpoint for inserting data into btc_prices table
app.post('/insert', (req, res) => {
    const { date, close, volume } = req.body;

    // Insert data into btc_prices table
    const insertSQL = `INSERT INTO btc_prices (date, close, volume) VALUES (?, ?, ?)`;
    db.run(insertSQL, [date, close, volume], (err) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log('Data inserted successfully');
            res.status(200).json({ message: 'Data inserted successfully' });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
