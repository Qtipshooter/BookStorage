// api.js
// Quinton Graham
// API endpoints for the Book Storage program

import express from "express";
import { get_books } from "../../api/books.js";

const router = express.Router()

router.get("/books", (request, response) => {
  let resp_data = "<h3>Hello</h3>";
  get_books().then((book_response) => {
    if(book_response.success) {
      for(let i = 0; i < book_response.data.length; i++) {
        resp_data += "<p>" + JSON.stringify(book_response.data[i]) + "</p><br>";
      }
    }
    else {
      console.log("Error" + book_response.error_message);
    }
    response.send(resp_data);
  });
  
})

export default router;