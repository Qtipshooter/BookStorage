// books.js
// Quinton Graham
// Book db functions for Book Storage Program

import { mdb_connect } from "../util/db_connection";

/** add_book
 * Add a book to the collection
 * @param {string} user_id
 * @param {Object} book
 * @return {Promise<Object>}
 */
async function add_book(user_id, book) {}

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