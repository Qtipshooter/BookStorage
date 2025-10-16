// books.js
// Quinton Graham
// Book db functions for Book Storage Program

import { mdb_connect } from "../util/db_connection";
import { get_ObjectID } from "./util";

/** add_book
 * Add a book to the collection
 * @param {string} user_id
 * @param {Object} book
 * @return {Promise<Object>}
 */
async function add_book(user_id, book) {
  // Init
  const db = mdb_connect();
  const books = db.collection("books");
  const oid = get_ObjectID(user_id);
  const check_isbn_10 = /^{0-9}[10]$/
  const check_isbn_13 = /^{0-9}[13]$/
  let new_book = {};

  // Check oid
  if(!oid) {
    return {
      success: false,
      error_message: "Invalid User ID supplied",
    }
  }

  // Check book object and copy over to new_book (sanitation)
  if(book) {

    // Required items
    if(typeof book.title === string) {new_book.title = book.title;}
    if(book.authors && book.authors instanceof Array){
      new_book.authors = []
      book.authors.forEach(author => {
        if(typeof author === string) {new_book.authors.push(author)}
      });
    }
    if(book.genres && book.genres instanceof Array){
      new_book.genres = []
      book.genres.forEach(genre => {
        if(typeof genre === string) {new_book.genres.push(genre);}
      });
    }
    if(typeof book.price === number){ new_book.price = book.price;}
    if(typeof book.description === string){ new_book.description = book.description;}
    if(typeof book.isbn_10 === number){
      if(book.isbn_10.match(check_isbn_10)) {
        new_book.isbn_10 = book.isbn_10;
      }
    }
    if(typeof book.isbn_13 === number){
      if(book.isbn_13.match(check_isbn_13)) {
        new_book.isbn_13 = book.isbn_13;
      }
    }
    // Non Required Items
  }

  // Check for duplicate unique identifiers (ISBN)

  // Insert book

  // Return result

}

/** update_book
 * Updates a book from owner or admin.  Only updates supplied fields, overwrites supplied fields
 * @param {string} user_id
 * @param {Object} book
 * @return {Promise<Object>}
 */
async function update_book(user_id, book) {}

/** update_book_owner
 * Updates owner from current user to new user or default user/admins only
 * @param {string} book_id
 * @param {string} current_user
 * @param {string} new_user
 * @return {Promise<Object>}
 */
async function update_book_owner(book_id, current_user, new_user) {}

/** delete_book
 * Deletes a book from db
 * !Constraints -> requestor has to be owner, and book must be in no other collections OR 
 * requestor has to be admin and will delete from all collections.
 * @param {string} user_id
 * @param {string} book_id
 * @return {Promise<Object>}
 */
async function delete_book(user_id, book_id) {}

/** get_book
 * Gets book by supplied ID
 * @param {string} book_id
 * @return {Promise<Object>}
 */
async function get_book(book_id) {}

/** find_book
 * Searches for a book based on supplied parameters
 * @param {Object} search_params
 * @return {Promise<Object>}
 */
async function find_book(search_params) {}

export { add_book, update_book, update_book_owner, delete_book, get_book, find_book }