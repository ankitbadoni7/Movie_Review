// ------------------- Load environment variables -------------------
require('dotenv').config();

console.log('Starting server...');
console.log('Environment:', process.env.NODE_ENV || 'development');

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------- Middleware -------------------
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// ------------------- MongoDB Connect -------------------
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/movieDB';
console.log('Connecting to MongoDB...');
console.log('MongoDB URI:', process.env.MONGO_URI ? '***MongoDB URI is set***' : 'MongoDB URI is NOT set!');

mongoose.connect(mongoURI, {
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
    console.log('Fetching movie ID:', id);

    if (!OMDB_API_KEY) {
        return res.status(500).json({ error: 'OMDB API key not set!' });
    }

    try {
        const response = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`);
        res.json(response.data);
    } catch (err) {
        console.error('OMDB fetch error:', err.response?.data || err.message);
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

// ------------------- Reviews & Reports Routes -------------------
const reviewRoutes = require('./routes/reviewRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/reviews', reviewRoutes);
app.use('/api/reports', reportRoutes);

// ------------------- Frontend Static Serve -------------------
const frontendPath = path.join(__dirname, '..');

// Serve HTML, CSS, JS, IMG
app.use(express.static(frontendPath));
app.use('/css', express.static(path.join(frontendPath, 'css')));
app.use('/js', express.static(path.join(frontendPath, 'js')));
app.use('/img', express.static(path.join(frontendPath, 'img')));

// Explicit HTML routes (optional, fallback handled by SPA)
app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
app.get('/movies.html', (req, res) => res.sendFile(path.join(frontendPath, 'movies.html')));
app.get('/series.html', (req, res) => res.sendFile(path.join(frontendPath, 'series.html')));
app.get('/reviews.html', (req, res) => res.sendFile(path.join(frontendPath, 'reviews.html')));
app.get('/report.html', (req, res) => res.sendFile(path.join(frontendPath, 'report.html')));

// ✅ SPA fallback for non-API routes (PathError fix)
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ------------------- Start Server -------------------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// ------------------- Export for Vercel -------------------
module.exports = app;
