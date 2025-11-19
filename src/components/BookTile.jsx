import React from "react";

export default function BookTile({ book, type="list"}) {
  if(type=="grid") {
    return (
      <div className="book-tile">
        <div>GRID</div>
        <div>Cover</div>
        <div>{book.rating}</div>
        <div>{book.title}</div>
        <div>{book.author}</div>
        <div>Add to Library Button</div>
      </div>
    )
  }
  else { // list
    return (
      <div className="book-tile">
        <div>LIST</div>
        <div>Cover</div>
        <div>{book.rating}</div>
        <div>{book.title}</div>
        <div>{book.author}</div>
        <div>{book.isbn_13 ? book.isbn_13 : (book.isbn_10 ? book.isbn_10 : "No ISBN Added")}</div>
        <div>{book.description ? book.description : "No Description Provided"}</div>
        <div>Add To Library button</div>
      </div>
    )
  }
}
