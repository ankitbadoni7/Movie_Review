require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// ------------------- Middleware -------------------
app.use(cors());
app.use(express.json());

// ------------------- MongoDB Connect -------------------
mongoose.connect(process.env.MONGO_URI, {
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
app.use(express.static(path.join(__dirname, '../')));

// ------------------- Safe Fallback for Frontend -------------------
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../', 'index.html'));
    }
});

// ------------------- Export for Vercel -------------------
module.exports = app;
