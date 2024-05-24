const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite module

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
    }
});

// Search endpoint for filtering data between dates
app.get('/search', (req, res) => {
    const { startDate, endDate } = req.query;

    // Query database for data between startDate and endDate
    const query = `SELECT * FROM BTCUSD WHERE date BETWEEN ? AND ?`;
    db.all(query, [startDate, endDate], (err, rows) => {
        if (err) {
            console.error('Error executing query:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;