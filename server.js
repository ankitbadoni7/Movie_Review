const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// static files serve
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/movies.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'movies.html'));
});

app.get('/series.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'series.html'));
});

app.get('/reviews.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'reviews.html'));
});

// CSS serve
app.use('/css', express.static(path.join(__dirname, 'css')));
// JS serve
app.use('/js', express.static(path.join(__dirname, 'js')));
// IMG serve
app.use('/img', express.static(path.join(__dirname, 'img')));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
