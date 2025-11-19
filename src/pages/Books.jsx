import React, { useEffect, useState } from "react";
import T_Home from "../templates/T_Home";
import BookTile from "../components/BookTile";
import BookList from "../components/BookList";

function Books({ books }) {

  const [book_set, set_book_set] = useState(books);
  useEffect(() => {
    if (!book_set) {
      set_book_set([{ title: "Re-Set Book" }]);
    }
  }, [])



  return (
    <T_Home>
      <h1>Books Page</h1>
      <p>Welcome to the Books page!</p>
      <div>
        <h1>As a List</h1>
        <BookList books={book_set}></BookList>
        <hr></hr>
        <h1>As a grid</h1>
        <BookList books={book_set} type="grid"></BookList>
      </div>
    </T_Home>
  )
};

export default Books;

