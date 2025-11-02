// libraries.js
// Quinton Graham
// Library db functions for Book Storage program
import { mdb_connect } from "../util/db_connection.js";
import { ERR, failure, get_ObjectID, success } from "./util.js";



/** get_library
 * Gets a user's library based on ID
 * @param {string} library_id The user to get the library of
 * @return {Promise<Object>} Returns the array of books for this library
 */
async function get_library(library_id) {
  // Init
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const lo_id = get_ObjectID(library_id);
  if (!lo_id) { return failure(ERR.INVALID_FORMAT, "Invalid library ID"); }
  const agg = [
    {
      '$match': {
        '_id': lo_id,
      }
    },
    {
      '$lookup': {
        'from': 'books',
        'localField': 'book_ids',
        'foreignField': '_id',
        'as': 'books'
      }
    },
    { '$project': { '_id': 0, 'books': 1 } }
  ]

  // Query
  const response_data = await libraries.aggregate(agg).toArray();
  if (!response_data.length) { 
    return failure(ERR.DATA_NOT_FOUND, "No books in library", response_data);
  }

  // Check if there are books, then send books to book query
  if (response_data[0].books.length) { 
    return success(response_data[0].books);
  }

  return failure(ERR.DATA_NOT_FOUND, "No Books in Library", response_data);

}

/** get_libraries
 * Gets a user's libraries
 * @param {string} user_id The user to get the libraries of
 * @return {Promise<Object>} Returns an array containing the library details (Minus books)
 */
async function get_libraries(user_id) {
  // Init
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const uo_id = get_ObjectID(user_id);
  if (!uo_id) { return failure(ERR.INVALID_FORMAT, "Invalid user id"); }
  const filter = { user_id: uo_id, }

  // Find and return
  const result = await find(filter).toArray();
  if (!result.length) { return failure(ERR.DATA_NOT_FOUND, "No Libraries for User"); }
  return success(result);

}


/** search_library
 * Searches user library with a search criteria
 * @param {string} user_id The user of the library to search in
 * @param {string} search_term The search term to send to search function
 * @return {Promise<Object>} Returns the book(s) in an array
 */
async function search_library(user_id, search_term) {

}

/** add_to_library
 * Adds a book to the current user library
 * @param {string} user_id User library to add to
 * @param {string} book_id The book to add
 * @return {Promise<Object>} Returns the success/fail state and the book_id/error_message
 */
async function add_to_library(user_id, book_id) {
  const db = await mdb_connect();
  const libraries = db.collection("libraries");

}

/** remove_from_library
 * @param {string} user_id User library to remove from
 * @param {string} book_id The book to remove
 * @return {Promise<Object>} Returns the success/fail state and the book_id/error_message
 */
async function remove_from_library(user_id, book_id) {

}

/** delete_user_library
 * @param {string} authorizing_user_id Library owner or an admin
 * @param {string} owner_id Owner of library to remove
 * @return {Promise<Object>}
 */
async function delete_user_library(authorizing_user_id, owner_id) {

}

// ADMIN FUNCTIONS //

/** admin_remove_from_library 
 * Removes a book from a user's library
 * @param {string} admin_id Logged in Admin ID
 * @param {string} owner_id Owner of library to delete from
 * @param {string} book_id ID of book to remove
 * @return {Promise<Object>} Returns the success/fail state and the book_id/error_message
 */
async function admin_remove_from_library(admin_id, owner_id, book_id) {

}

/** admin_remove_from_all_libraries
 * Removes a book from all libraries in preparation to delete book
 * @param {string} admin_id ID of Authorizing Admin
 * @param {string} book_id ID of book to remove
 * @return {Promise<Object>} Returns the success/fail state and the book_id/error_message
 */
async function admin_remove_from_all_libraries(admin_id, book_id) {

}

/** admin_get_library
 * Gets a users library
 * @param {string} admin_id
 * @param {string} user_id
 * @return {Promise<Object>} Returns the success/fail state and the book_collection/error_message
 */
async function admin_get_library(admin_id, user_id) {

}

export {
  get_library,
  search_library,
  add_to_library,
  remove_from_library,
  delete_user_library,
  admin_remove_from_library,
  admin_remove_from_all_libraries,
  admin_get_library,
}