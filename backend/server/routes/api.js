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
      console.log(book_response);
      console.log(book_response.data);
      console.log(book_response.data.length);
      for(let i = 0; i < book_response.data.length; i++) {
        resp_data += "<h3>" + JSON.stringify(book_response.data[i]) + "</h3><br>";
        console.log(book_response.data[i]);
      }
    }
    else {
      console.log("Error" + book_response.error_message);
    }
    response.send(resp_data);
  });
  
})

export default router;