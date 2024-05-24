// Import necessary modules
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Initialize Express app
const app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Use defined routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Sample data
const backendData = [
    { date: '2024-05-01', value: 'Data 1' },
    { date: '2024-05-05', value: 'Data 2' },
    { date: '2024-05-10', value: 'Data 3' }
];

// Search endpoint for filtering data between dates
app.get('/search', (req, res) => {
    const { startDate, endDate } = req.query;

    // Filter data between startDate and endDate
    const filteredData = backendData.filter(item =>
        item.date >= startDate && item.date <= endDate
    );

    res.json(filteredData);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
