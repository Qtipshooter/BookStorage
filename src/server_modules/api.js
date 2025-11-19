// api.js
// Quinton Graham
// API endpoints for Book Storage Program

import express from "express";
import { get_books } from "../../backend/api/books.js";

// Router Configuration
const router = express.Router();

/** Books API **/
router.get("/books", async (request, response) => {
  const books = await get_books().then((res) => {
    if (res.success) {
      return res.data;
    }
    else {
      console.log("ERR: /api" + request.url + "\n  Message: " + res.error_message);
      return null;
    }
  });

  if (books) {
    response.set("Content-Type", "application/json");
    response.status(200).send(books);
  }
  else {
    response.status(500).send("Error finding books");
  }
});


export default router;