// api.js
// Quinton Graham
// API endpoints for Book Storage Program

import express from "express";
import { get_books } from "../backend/books.js";

// Router Configuration
const router = express.Router();

/** Books API **/
router.get("/books", async (request, response) => {
  let books;
  try { books = await get_books(); }
  catch (e) { console.log("ERR: /api" + request.url + "\n  Message: " + e.error_message); }

  if (books) {
    response.set("Content-Type", "application/json");
    response.status(200).send(books);
  }
  else {
    response.status(500).send("Error finding books");
  }
});


export default router;