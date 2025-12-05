const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'my_super_secret_key_u29'; // Simple secret for this project

// *** CONFIGURATION ***
// REPLACE 'admin' with your actual First Name (as per requirements)
const MY_NAME = 'udaykiranreddy'; 


// REPLACE with your actual MySQL root password
const DB_PASSWORD = 'pass123'; 

// Middleware
app.use(cors()); // Allow frontend (Port 80) to talk to backend (Port 3000)
app.use(bodyParser.json());

// Database Connection
// Database Connection (Pool)
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'u29_user',
    password: 'pass123',
    database: 'u29_project',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check connection (Optional, just for logs)
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database via Pool');
        connection.release(); // Always release the connection back to the pool!
    }
});

// --- ROUTES ---

// 1. LOGIN ROUTE
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded check: Username and Password must match your First Name
    if (username === MY_NAME && password === MY_NAME) {
        // Create a JWT token valid for 1 hour
        const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Middleware to Verify JWT for protected routes
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, SECRET_KEY, (err, authData) => {
            if (err) {
                res.sendStatus(403); // Forbidden
            } else {
                req.authData = authData;
                next();
            }
        });
    } else {
        res.sendStatus(403); // Forbidden
    }
};

// 2. CHART 1 DATA (Efficiency)
app.get('/api/chart1', verifyToken, (req, res) => {
    db.query('SELECT * FROM innovation_stats WHERE chart_id = 1', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 3. CHART 2 DATA (Energy Yield)
app.get('/api/chart2', verifyToken, (req, res) => {
    db.query('SELECT * FROM innovation_stats WHERE chart_id = 2', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
