require('dotenv').config(); // dotenv sirf ek baar

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // ✅ POST ke liye zaroori

// MongoDB connect
// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'movieDB'  // ✅ Explicit database
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// OMDB API key from .env
const OMDB_API_KEY = process.env.OMDB_API_KEY;

// API route to fetch movie by ID
app.get('/api/movie/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movie data' });
    }
});

// ✅ Reviews routes import
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

// ✅ Reports route import
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);


