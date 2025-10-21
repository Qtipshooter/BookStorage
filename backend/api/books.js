// books.js
// Quinton Graham
// Book db functions for Book Storage Program

import { mdb_connect } from "../util/db_connection.js";
import { check_level, get_user, get_user_by_id } from "./users.js";
import { get_ObjectID } from "./util.js";

/** add_book
 * Add a book to the collection
 * @param {string} user_id
 * @param {Object} book
 * @return {Promise<Object>}
 */
async function add_book(user_id, book) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const users = db.collection("users");
  const oid = get_ObjectID(user_id);
  const check_isbn_10 = /^[0-9]{10}$/
  const check_isbn_13 = /^[0-9]{13}$/
  let user = null;
  let duplicate = null;
  let new_book = {};

  // Check oid
  if (!oid) {
    return {
      success: false,
      error_message: "Invalid User ID supplied",
      error_data: user_id
    }
  }
  user = await get_user_by_id(user_id);
  if (!user.success) {
    return {
      success: false,
      error_message: "User does not exist",
      error_data: user_id
    }
  }

  new_book.user_id = oid;

  // Check book object and copy over to new_book (sanitation)
  if (book) {
    let all_required = true; // Verification that all required items are present

    // Required items
    if (typeof book.title === "string") {
      new_book.title = book.title;
    }
    else {
      all_required = false;
    }
    if (book.authors && book.authors instanceof Array) {
      new_book.authors = []
      book.authors.forEach(author => {
        if (typeof author === "string") {
          new_book.authors.push(author)
        }
      });
    }
    else {
      all_required = false;
    }

    // Return about missing reqs
    if (!all_required) {
      return {
        success: false,
        error_message: "Missing required book data (ex. Title)",
      }
    }

    // Non Required Items
    if (book.genres && book.genres instanceof Array) {
      new_book.genres = []
      book.genres.forEach(genre => {
        if (typeof genre === "string") { new_book.genres.push(genre); }
      });
    }
    if (typeof book.description === "string") {
      new_book.description = book.description;
    }
    if(book.isbn_10) {
      if (typeof book.isbn_10 === "string") {
        if (book.isbn_10.match(check_isbn_10)) {
          new_book.isbn_10 = book.isbn_10;
        }
      }
      else {
        return {
          success: false,
          error_message: "Improperly formatted ISBN"
        }
      }
    }
    if(book.isbn_13) {
      if (typeof book.isbn_13 === "string") {
        if (book.isbn_13.match(check_isbn_13)) {
          new_book.isbn_13 = book.isbn_13;
        }
      }
      else {
        return {
          success: false,
          error_message: "Improperly formatted ISBN"
        }
      }
    }
  }
  else {
    return {
      success: false,
      error_message: "No book data supplied"
    }
  }

  // Check for duplicate unique identifiers (ISBN)
  if (new_book.isbn_10) {
    duplicate = await books.findOne({ isbn_10: new_book.isbn_10 })
    if (duplicate) {
      return {
        success: false,
        error_message: "Duplicate ISBN number",
        error_data: duplicate
      }
    }
  }
  if (new_book.isbn_13) {
    duplicate = await books.findOne({ isbn_13: new_book.isbn_13 })
    if (duplicate) {
      return {
        success: false,
        error_message: "Duplicate ISBN number",
        error_data: duplicate
      }
    }
  }

  // Insert book
  const book_id = await books.insertOne(new_book).then((res) => {
    return res.insertedId;
  })

  // Return result
  if (book_id) {
    return {
      success: true,
      data: book_id
    }
  }
}

/** update_book
 * Updates a book from owner or admin.  Only updates supplied fields, overwrites supplied fields
 * @param {string} user_id
 * @param {Object} book
 * @return {Promise<Object>}
 */
async function update_book(user_id, book) { }

/** update_book_owner
 * Updates owner from current user to new user or default user/admins only
 * @param {string} book_id
 * @param {string} current_user
 * @param {string} new_username
 * @return {Promise<Object>}
 */
async function update_book_owner(book_id, current_user, new_username) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const current_id = get_ObjectID(current_user);
  const request_validated = false;

  // Get book and its current user
  const new_id = await get_user(new_username).then((res) => {
    if(res.success) {
      return res.data._id;
    }
    else {
      return null;
    }
  })

  if(!new_id) {
    return {
      success: false,
      error_message: "Invalid new user",
    }
  }

  const book_owner = await get_book(book_id).then((res) => {
    if(res.success) {
      return res.data.user_id.toString();
    }
    return false;
  })
  if(!book_owner) {
    return {
      success: false,
      error_message: "Invalid book"
    }
  }

  const user_level = await check_level(current_user).then((res) => {
    if (res.success) {
      return res.data;
    }
    return false;
  })
  if(user_level == "admin") {
    request_validated = true;
  }
  if(current_user == book_owner) {
    request_validated = true;
  }
  if(!request_validated) {
    return {
      success: false,
      error_message: "Invalid Request User"
    }
  }

  const book_update_result = await books.updateOne({_id: get_ObjectID(book)}, {$set: {user_id: new_id}});

  if(book_update_result.modifiedCount) {
    return {
      success: true,
      data: book_update_result.modifiedCount
    }
  }
  else {
    return {
      success: false,
      error_message: "Error updating book owner",
      error_data: book_update_result
    }
  }
}

/** delete_book
 * Deletes a book from db
 * !Constraints -> requestor has to be owner, and book must be in no other collections OR 
 * requestor has to be admin and will delete from all collections.
 * @param {string} user_id
 * @param {string} book_id
 * @return {Promise<Object>}
 */
async function delete_book(user_id, book_id) { }

/** get_book
 * Gets book by supplied ID
 * @param {string} book_id
 * @return {Promise<Object>}
 */
async function get_book(book_id) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const obj_id = get_ObjectID(book_id);

  // Verify ID
  if (!obj_id) {
    return {
      success: false,
      error_message: "Invalid book ID",
    }
  }

  // Get Book
  const book = await books.findOne({ _id: obj_id });
  if (book) {
    return {
      success: true,
      data: book
    }
  }
  else {
    return {
      success: false,
      error_message: "Book not found",
    }
  }
}

/** find_book
 * Searches for a book based on supplied parameters
 * @param {Object} search_params
 * @return {Promise<Object>}
 */
async function find_book(search_params) { }

export { add_book, update_book, update_book_owner, delete_book, get_book, find_book }