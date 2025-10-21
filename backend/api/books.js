// books.js
// Quinton Graham
// Book db functions for Book Storage Program

import { mdb_connect } from "../util/db_connection.js";
import { check_level, get_user, get_user_by_id } from "./users.js";
import { get_ObjectID, sanitize_book } from "./util.js";

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
  const oid = get_ObjectID(user_id);
  let user = null;
  let duplicate = null;
  let new_book = sanitize_book(book);

  // Check input params
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
  if(!new_book) {
    return {
      success: false,
      error_message: "Invalid Book data supplied"
    }
  }

  new_book.user_id = oid;

  //console.log(JSON.stringify(new_book));

  // Verify necessary parameters are included
  if(!new_book.title || !new_book.authors){
    return {
      success: false,
      error_message: "Missing required book data (Title and Authors)",
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
async function search_books(search_params) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  
  // 
}

export { add_book, update_book, update_book_owner, delete_book, get_book, search_books }