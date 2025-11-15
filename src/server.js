// server.js
// Quinton Graham
// Main Server file for the Book Storage Program

import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import path from 'path';
import { fileURLToPath } from 'url';

import { render_HTML } from './util/util.js';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Books from './pages/Books.jsx';
import Default_Head from './templates/Default_Head.jsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

/** Logging */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

/** Middleware/Connected routes */
app.use(express.json());
app.use('/static/', express.static(path.resolve(__dirname, "..", "static", "public")));

/** Base Pages */
// Home page
app.get('/', (req, res) => {
  res.send(render_HTML(renderToString(<Home />), "home.bundle.js", renderToString(<Default_Head />)));
});

// About page
app.get('/about', (req, res) => {
  res.send(render_HTML(renderToString(<About />), "about.bundle.js", renderToString(<Default_Head />)));
});

// Books page
app.get('/books', (req, res) => {
  res.send(render_HTML(renderToString(<Books />), "books.bundle.js", renderToString(<Default_Head />)));
});

app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`));
