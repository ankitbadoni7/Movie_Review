// Load environment variables first
require('dotenv').config();

console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV || 'development');

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// ------------------- Middleware -------------------
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ------------------- MongoDB Connect -------------------
console.log('Connecting to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? '***MongoDB URI is set***' : 'MongoDB URI is NOT set!');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movieDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'movieDB'
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ------------------- OMDB API Route -------------------
const OMDB_API_KEY = process.env.OMDB_API_KEY;

app.get('/api/movie/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movie data' });
    }
});

// ------------------- Reviews & Reports Routes -------------------
const reviewRoutes = require('./routes/reviewRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/reviews', reviewRoutes);
app.use('/api/reports', reportRoutes);

// ------------------- Frontend Static Serve -------------------
app.use(express.static(path.join(__dirname, '..')));

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '..', 'index.html'));
    } else {
        res.status(404).json({ error: 'API route not found' });
    }
});

// ------------------- Export for Vercel -------------------
module.exports = app;
