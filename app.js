const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite module

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create database connection
const db = new sqlite3.Database('path/to/your/sqlite.db');

// Search endpoint for filtering data between dates
app.get('/search', (req, res) => {
    const { startDate, endDate } = req.query;

    // Query database for data between startDate and endDate
    const query = `SELECT * FROM your_table WHERE date BETWEEN ? AND ?`;
    db.all(query, [startDate, endDate], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
