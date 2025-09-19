// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// ==========================
// GET review by movieId
// ==========================
router.get('/:movieId', async (req, res) => {
  const { movieId } = req.params;
  console.log("👉 Requested movieId:", movieId); // Debug log

  try {
    const review = await Review.findOne({ movieId });
    console.log("👉 Found review:", review); // Debug log

    if (!review) {
      return res.json({ reviewText: null, trailerId: null }); // ✅ Added trailerId null when no review
    }

    // ✅ Send reviewText AND trailerId to frontend
    res.json({ 
      reviewText: review.reviewText,
      trailerId: review.trailerId || null  // ✅ New field added
    });
  } catch (err) {
    console.error('❌ GET /api/reviews error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// POST (add or update) review by movieId
// ==========================
router.post('/:movieId', async (req, res) => {
  const { movieId } = req.params;
  const { reviewText, trailerId } = req.body; // ✅ Accept trailerId from request body

  if (!reviewText) {
    return res.status(400).json({ error: 'reviewText required' });
  }

  try {
    const review = await Review.findOneAndUpdate(
      { movieId },
      { reviewText, trailerId, createdAt: new Date() }, // ✅ Save/update trailerId
      { upsert: true, new: true }
    );

    console.log("✅ Review saved/updated:", review); // Debug log
    res.json({ message: 'Review saved', review });
  } catch (err) {
    console.error('❌ POST /api/reviews error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET movieId by movie title
router.get('/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const review = await Review.findOne({ movieTitle: title }); // movieTitle field add if needed
    if(!review) return res.status(404).json({ error: "Movie not found" });
    res.json({ movieId: review.movieId });
  } catch(err) {
    console.error('GET /api/reviews/title/:title error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
