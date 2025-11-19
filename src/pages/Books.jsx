import React, { useEffect, useState } from "react";
import T_Home from "../templates/T_Home";
import BookTile from "../components/BookTile";
import BookList from "../components/BookList";

export default function Books({ books }) {

  const [book_set, set_book_set] = useState(books);
  useEffect(() => {
    if (!book_set) {
      set_book_set([{ title: "Re-Set Book" }]);
    }
  }, [])



  return (
    <T_Home>
      <div className="page-container">
        <div className="left">
          <div>Left Side Modal</div>
        </div>
        <div className="center">
          <div>Book Search</div>
          <div>How to use Blurb</div>
          <BookList books={book_set} type="grid"></BookList>
        </div>
        <div className="right">
          <div>Right Side Modal</div>
        </div>
      </div>
    </T_Home>
  )
};
