const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

// Import your Express app
const app = require('../backend/server');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Create a simple server that passes requests to Express
const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;
  
  // Handle API routes with Express
  if (pathname.startsWith('/api/')) {
    return app(req, res);
  }
  
  // Handle Next.js pages or static files if you have any
  // Otherwise, let Express handle it
  app(req, res);
});

// Start the server
server.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://${hostname}:${port}`);
});
