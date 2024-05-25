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
const dbPath = path.join(__dirname, 'db', 'sqlite.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database');
    }
});

// Search endpoint for filtering data between dates
app.get('/search', (req, res) => {
    const { startDate, endDate } = req.query;

    console.log('Received request to search data between dates:', startDate, 'and', endDate);

    // Query database for data between startDate and endDate
    const query = `SELECT Date, Close, Volume FROM BTCUSD WHERE Date BETWEEN ? AND ?`;
    db.all(query, [startDate, endDate], (err, rows) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log('Data retrieved from the database:', rows);
            res.json(rows);
        }
    });
});

// Endpoint for inserting data into BTCUSD table
app.post('/insert', (req, res) => {
    const { date, open, high, low, close, adj_close, volume } = req.body;

    // Insert data into BTCUSD table
    const insertSQL = `INSERT INTO BTCUSD (Date, Open, High, Low, Close, Adj_Close, Volume) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(insertSQL, [date, open, high, low, close, adj_close, volume], (err) => {
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
