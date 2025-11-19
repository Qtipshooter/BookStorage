import React from "react";

function BookTile({ book, type="list"}) {
  if(type=="grid") {
    return (
      <div className="book-tile">
        <div>GRID</div>
        <div>Cover</div>
        <div>Rating</div>
        <div>{book.title}</div>
        <div>Author(s)</div>
        <div>Add to Library Button</div>
      </div>
    )
  }
  else { // list
    return (
      <div className="book-tile">
        <div>LIST</div>
        <div>Cover</div>
        <div>Rating</div>
        <div>{book.title}</div>
        <div>Author(s)</div>
        <div>ISBN if 13 then 13 else 10 else blank</div>
        <div>Description else "No Description Added"</div>
        <div>Add To Library button</div>
      </div>
    )
  }
}

export default BookTile;