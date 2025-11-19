import React, { useState } from "react";
import BookTile from "./BookTile";

export default function BookList({ books, type = "list" }) {

  let book_set = books ? books : [];
  const [is_grid, toggle_is_grid] = useState(type == "grid" ? true : false);

  function toggle_grid() { toggle_is_grid(!is_grid); }

  return (
    <div className="book-list">
      <div className="bl-options-block">
        <div className="search-bar">Search Bar</div>
        <div>Per Page Selection</div>
        <div onClick={toggle_grid}>Toggle Grid</div>
        <div>Pages Selection Section</div>
      </div>
      <div>
        <div>
          {book_set.map((book) => { return (<BookTile book={book} type={is_grid ? "grid" : "list"}></BookTile>) })}
        </div>
      </div>
    </div>
  )
}
