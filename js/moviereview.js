// ==========================
// Modal functionality
// ==========================
const modal = document.getElementById('trailerModal');
const btn = document.getElementById('trailerBtn');
const closeBtn = document.getElementsByClassName('close-btn')[0];
const video = document.getElementById('youtubeTrailer');

let trailerId = null; // will store the dynamic trailer ID

btn.addEventListener('click', () => {
    if (!trailerId) return alert("Trailer not available!");
    modal.style.display = 'flex';
    video.src = `https://www.youtube.com/embed/${trailerId}?autoplay=1`;
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.style.display = 'none';
    video.src = '';
    document.body.style.overflow = 'auto';
}

// ==========================
// Get movie ID from URL
// ==========================
const movieId = new URLSearchParams(window.location.search).get('id');

// ==========================
// OMDB fetch
// ==========================
(async function fetchMovie() {
    if (!movieId) {
        document.getElementById('error').innerText = 'No movie id in URL';
        return;
    }
    try {
        const res = await fetch(`http://localhost:5000/api/movie/${movieId}`);
        const movie = await res.json();
        if (movie.Response === "False") {
            document.getElementById('error').innerText = movie.Error || 'Movie not found';
            return;
        }

        document.getElementById('title').innerText = `${movie.Title} (${movie.Year})`;
        document.getElementById('year').innerText = movie.Year || '';
        document.getElementById('genre').innerText = movie.Genre || '';
        document.getElementById('plot').innerText = movie.Plot || '';
        document.getElementById('actors').innerText = movie.Actors || '';
        document.getElementById('poster').src = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'img/no-poster.png';
        document.getElementById('rating').innerText = movie.imdbRating ? `⭐ ${movie.imdbRating}/10` : '⭐ N/A';
    } catch (err) {
        document.getElementById('error').innerText = 'Error loading movie: ' + err.message;
    }
})();

// ==========================
// Review + Trailer fetch
// ==========================
const reviewParagraph = document.querySelector('.movRev p');

async function fetchCustomReview() {
    try {
        const res = await fetch(`http://localhost:5000/api/reviews/${movieId}`);
        const data = await res.json();

        reviewParagraph.innerHTML = data.reviewText || 'No review yet.';
        trailerId = data.trailerId; // dynamically save trailer ID
    } catch (err) {
        reviewParagraph.textContent = 'Error loading review';
    }
}

// Call on page load
fetchCustomReview();

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".newsletter-form");

    if (!form) return; // form nahi mila toh exit

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // page reload rokega
        alert("This is a demo project. Subscribing won’t give you real emails");
        form.reset(); // input clear ho jaaye
    });
});


document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");

    const reviewParagraph = document.querySelector('.movRev p');

    if (!movieId) {
        reviewParagraph.innerHTML = "<p>No review available</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/reviews/${movieId}`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        if (data && data.reviewText) {
            reviewParagraph.innerHTML = data.reviewText;
        } else {
            reviewParagraph.innerHTML = "No review available";
        }
    } catch (error) {
        console.error("Error fetching review:", error);
        reviewParagraph.innerHTML = "No review available";
    }
});

// ==========================
// Comments system
// ==========================
const reviewForm = document.getElementById('reviewForm');
const commentNameInput = document.getElementById('name');
const commentTextInput = document.getElementById('review');


// Container to render comments dynamically
let commentsContainer = document.createElement('div');
commentsContainer.id = 'commentsContainer';
commentsContainer.style.marginTop = '20px';
reviewForm.parentNode.insertBefore(commentsContainer, reviewForm.nextSibling);

async function fetchComments() {
    try {
        const res = await fetch(`http://localhost:5000/api/comments/${movieId}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.comments)) {
            if (data.comments.length === 0) {
                commentsContainer.innerHTML = '<p>No comments yet.</p>';
            } else {
                renderComments(data.comments);
            }
        } else {
            commentsContainer.innerHTML = '<p>No comments yet.</p>';
        }
    } catch (err) {
        console.error("Error fetching comments:", err);
        commentsContainer.innerHTML = '<p>No comments yet.</p>';
    }
}


function renderComments(comments) {
    commentsContainer.innerHTML = '';
    comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'comment-card';
        div.style.border = '1px solid #ccc';
        div.style.padding = '10px';
        div.style.marginBottom = '10px';
        div.style.borderRadius = '5px';

        div.innerHTML = `
            <strong>${c.userName}</strong> <span style="color: gray; font-size: 0.8rem;">(${new Date(c.createdAt).toLocaleString()})</span>
            <p>${c.commentText}</p>
        `;
        commentsContainer.appendChild(div);
    });
}

reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const commentName = commentNameInput.value.trim();
    const commentText = commentTextInput.value.trim();
    if (!commentName || !commentText) return alert('Name and comment cannot be empty');

    try {
        const res = await fetch(`http://localhost:5000/api/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ commentText, movieId })
        });

        const data = await res.json();

        if (data.success) {
            alert('Comment submitted successfully!'); // ✅ success message
            commentTextInput.value = '';
            fetchComments(); // ✅ refresh comments
        } else {
            alert(data.message || 'Failed to submit comment');
        }
    } catch (err) {
        console.error("Error submitting comment:", err);
        alert('Error submitting comment');
    }
});


// Call fetchComments on page load
fetchComments();


