// ----------------------
// 🔹 DOMContentLoaded - All Events
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  // ----------------------
  // 🔹 Base URL Setup
  // ----------------------
  const baseURL = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://movie-review-git-main-ankit-badonis-projects.vercel.app/api"; // <- apne backend project ka URL yaha daalna

  // ----------------------
  // 🔹 Slider
  // ----------------------
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let index = 0;
  let intervalId;

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));
    if (i >= slides.length) i = 0;
    if (i < 0) i = slides.length - 1;
    slides[i].classList.add("active");
    dots[i].classList.add("active");
    index = i;
  }

  function startSlideshow() {
    clearInterval(intervalId);
    intervalId = setInterval(() => showSlide(index + 1), 8000);
  }

  dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); startSlideshow(); }));
  if (slides.length > 0) startSlideshow();

  // ----------------------
  // 🔹 Movie Card Click
  // ----------------------
  document.querySelectorAll(".movie-card").forEach(card => {
    card.addEventListener("click", () => {
      const movieId = card.getAttribute("data-id");
      if (movieId) window.location.href = `movie_review.html?id=${movieId}`;
    });
  });

  // ----------------------
  // 🔹 Trailer Modal
  // ----------------------
  const trailerButtons = document.querySelectorAll("[data-video]");
  trailerButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const videoId = this.getAttribute("data-video");
      if (!videoId) return;
      const modal = document.createElement("div");
      modal.classList.add("modal");
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <iframe width="560" height="315"
              src="https://www.youtube.com/embed/${videoId}?autoplay=1"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen>
          </iframe>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector(".close").addEventListener("click", () => modal.remove());
      modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
    });
  });

  // ----------------------
  // 🔹 Newsletter Form
  // ----------------------
  const form = document.querySelector(".newsletter-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert("This is a demo project. Subscribing won’t give you real emails");
      form.reset();
    });
  }

  // ----------------------
  // 🔹 Review Button
  // ----------------------
  document.querySelectorAll(".reviewBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const movieCard = btn.closest(".hero-content");
      if (!movieCard) return;
      const title = movieCard.querySelector("h1")?.innerText;
      if (!title) return;

      try {
        const res = await fetch(`${baseURL}/api/reviews/title/${encodeURIComponent(title)}`);
        const data = await res.json();
        if (data.movieId) window.location.href = `movie_review.html?id=${data.movieId}`;
        else alert("Movie ID not found for " + title);
      } catch (err) {
        console.error(err);
        alert("Movie review not added yet.");
      }
    });
  });

  // ----------------------
  // 🔹 View All Button
  // ----------------------
  const viewAllBtn = document.getElementById("viewAllBtn");
  if (viewAllBtn) viewAllBtn.addEventListener("click", () => window.location.href = "movies.html");

  // ----------------------
  // 🔹 Search (movies.html)
  // ----------------------
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchBtn");
  const movieCards = document.querySelectorAll(".movie-card");
  const noMovies = document.getElementById("noMovies");

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.toLowerCase().trim();
      let anyVisible = false;

      movieCards.forEach(card => {
        const title = card.querySelector("h1")?.textContent.toLowerCase() || "";
        if (title.includes(query)) {
          card.style.display = "block";
          anyVisible = true;
        } else card.style.display = "none";
      });

      if (noMovies) noMovies.style.display = anyVisible ? "none" : "block";
    });

    searchInput.addEventListener("keypress", e => { if (e.key === "Enter") searchButton.click(); });
  }

  // ----------------------
  // 🔹 Hamburger Menu
  // ----------------------
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', hamburger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });
  }

  // ----------------------
  // 🔹 Smooth Scroll for Anchor Links
  // ----------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        if (mobileMenu?.classList.contains('active')) mobileMenu.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ----------------------
  // 🔹 Scroll Animations
  // ----------------------
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section, .movie-card, .review-card').forEach(el => observer.observe(el));
});

// ----------------------
// 🔹 Mobile Menu Search
// ----------------------
const searchInputMobile = document.getElementById("searchInputMobile");
const searchButtonMobile = document.getElementById("searchBtnMobile");

if (searchInputMobile && searchButtonMobile) {
  searchButtonMobile.addEventListener("click", () => {
    const query = searchInputMobile.value.toLowerCase().trim();
    let anyVisible = false;

    document.querySelectorAll(".movie-card").forEach(card => {
      const title = card.querySelector("h1")?.textContent.toLowerCase() || "";
      if (title.includes(query)) {
        card.style.display = "block";
        anyVisible = true;
      } else card.style.display = "none";
    });

    const noMovies = document.getElementById("noMovies");
    if (noMovies) noMovies.style.display = anyVisible ? "none" : "block";
  });

  searchInputMobile.addEventListener("keypress", e => { 
    if (e.key === "Enter") searchButtonMobile.click(); 
  });
}
