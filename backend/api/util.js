// util.js
// Quinton Graham
// Utility functions for Book Storage Program

import { ObjectId } from "mongodb";

/** get_ObjectID
 * Converts strings to ObjectIDs for mongodb
 * @param {string} o_id ObjectID to be converted from string 
 * @returns {ObjectID | null} ObjectID on success and null of failure (easy to check)
 */
function get_ObjectID(o_id) {
  try {
    return ObjectId.createFromHexString(o_id);
  }
  catch (err) {
    // Type error or format error
    return null;
  }
}

/** sanitize_book 
 * Checks a supplied book object and filters out any invalid parameters.  Returns unsuccessful if no parameters are valid.  
 * Returns valid book object if available.  ObjectIDs are given as ObjectIDs rather than strings.  If conversion from string fails,
 * then they are omitted.  Fixes books with single author/genres to be in correct array format
 * @param {Object} original_book
 * @return {Object | null} sanitized book on success and null on failure
 */
function sanitize_book(original_book) {
  // Init
  let new_book = {} // New Book to build to return.
  const check_isbn_10 = /^[0-9]{10}$/
  const check_isbn_13 = /^[0-9]{13}$/

  if (typeof original_book !== "object") {
    return null;
  }

  // Check for each field, then if valid or valid adjacent, convert and add to new book
  // _id Field
  if (original_book._id) {
    if (original_book._id instanceof ObjectId) {
      new_book._id = original_book._id;
    }
    else if (typeof original_book._id === "string" && get_ObjectID(original_book._id)) {
      new_book._id = get_ObjectID(original_book._id);
    }
  }

  // user_id Field
  if (original_book.user_id) {
    if (original_book.user_id instanceof ObjectId) {
      new_book.user_id = original_book.user_id;
    }
    else if (typeof original_book.user_id === "string" && get_ObjectID(original_book.user_id)) {
      new_book.user_id = get_ObjectID(original_book.user_id);
    }
  }

  // title Field
  if (original_book.title) {
    if (typeof original_book.title === "string") {
      new_book.title = original_book.title
    }
  }

  // authors Field
  if (original_book.authors) {
    if (original_book.authors instanceof Array) {
      new_book.authors = [];
      original_book.authors.forEach(author => {
        if (typeof author === "string") {
          new_book.authors.push(author);
        }
      });
      // To not return/accidentally overwrite with empty data 
      if (new_book.authors.length < 1) {
        delete new_book.authors;
      }
    }
    else if (original_book.authors === "string") {
      new_book.authors = [original_book.authors];
    }
  }

  // genres Field
  if (original_book.genres) {
    if (original_book.genres instanceof Array) {
      new_book.genres = [];
      original_book.genres.forEach(genre => {
        if (typeof genre === "string") {
          new_book.genres.push(genre);
        }
      });
      // To not return/accidentally overwrite with empty data 
      if (new_book.genres.length < 1) {
        delete new_book.genres;
      }
    }
    else if (original_book.genres === "string") {
      new_book.genres = [original_book.genres];
    }
  }

  // descripion Field
  if (original_book.description) {
    if (typeof original_book.description === "string") {
      new_book.description = original_book.description
    }
  }

  // isbn_10 Field
  if (original_book.isbn_10) {
    if (typeof original_book.isbn_10 === "string" && original_book.isbn_10.match(check_isbn_10)) {
      new_book.isbn_10 = original_book.isbn_10
    }
  }

  // isbn_13 Field
  if (original_book.isbn_13) {
    if (typeof original_book.isbn_13 === "string" && original_book.isbn_13.match(check_isbn_13)) {
      new_book.isbn_13 = original_book.isbn_13
    }
  }

  if (Object.keys(new_book).length === 0) {
    return null;
  }
  return new_book;
}

export {
  get_ObjectID,
  sanitize_book,
}