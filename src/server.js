// server.js
// Quinton Graham
// Main Server file for the Book Storage Program

import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import path from 'path';
import { fileURLToPath } from 'url';

import { render_HTML } from './util/util.js';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Books from './pages/Books.jsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

/** Middleware/Connected routes */
app.use('/static', express.static(path.resolve(__dirname, 'public')));
app.use(express.json());

/** Logging */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

/** Base Pages */
// Home page
app.get('/', (req, res) => {
  const appString = ReactDOMServer.renderToString(<Home />);
  res.send(render_HTML(appString, 'home.bundle.js'));
});

// About page
app.get('/about', (req, res) => {
  const appString = ReactDOMServer.renderToString(<About />);
  res.send(render_HTML(appString, 'about.bundle.js'));
});

// Books page
app.get('/books', (req, res) => {
  const appString = ReactDOMServer.renderToString(<Books />);
  res.send(render_HTML(appString, 'books.bundle.js'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
