import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import path from 'path';
import { fileURLToPath } from 'url';
import Template from '../src/components/Template.jsx';
import Home from '../src/components/Home.jsx';
import About from '../src/components/About.jsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/static', express.static(path.resolve(__dirname, 'public')));

// Home page
app.get('/', (req, res) => {
  const appString = ReactDOMServer.renderToString(<Template><Home /></Template>);
  res.send(renderHTML(appString, 'home.bundle.js'));
});

// About page
app.get('/about', (req, res) => {
  const appString = ReactDOMServer.renderToString(<Template><About /></Template>);
  res.send(renderHTML(appString, 'about.bundle.js'));
});

function renderHTML(appString, bundleFile) {
  return `<!DOCTYPE html>
<html>
  <head><title>SSR React App</title></head>
  <body>
    <div id="root">${appString}</div>
    <script type="module" src="/static/${bundleFile}"></script>
  </body>
</html>`;
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
