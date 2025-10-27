// libraries.js
// Quinton Graham
// Library db functions for Book Storage program



/** get_library
 * Gets current user's library
 * @param {string} user_id The user to get the library of
 * @return {Promise<Object>} Returns the cursor of books for this library
 */

/** search_library
 * Searches user library with a search criteria
 * @param {string} user_id The user of the library to search in
 * @param {string} search_term The search term to send to search function
 * @return {Promise<Object>} Returns the book(s) in an array
 */

/** add_to_library
 * Adds a book to the current user library
 * @param {string} user_id User library to add to
 * @param {string} book_id The book to add
 * @return {Promise<Object>} Returns the success/fail state and the book_id/error_message
 */

/** remove_from_library
 * @param {string} user_id User library to remove from
 * @param {string} book_id The book to remove
 * @return {Promise<Object>} Returns the success/fail state and the book_id/error_message
 */

/** delete_user_library
 * @param {string} authorizing_user_id Library owner or an admin
 * @param {string} owner_id Owner of library to remove
 * @return {Promise<Object>}
 */

// ADMIN FUNCTIONS //

/** admin_remove_from_library 
 * Removes a book from a user's library
 * @param {string} admin_id Logged in Admin ID
 * @param {string} owner_id Owner of library to delete from
 * @param {string} book_id ID of book to remove
 * @return {Promise<Object>} Returns the success/fail state and the book_id/error_message
 */

/** admin_remove_from_all_libraries
 * Removes a book from all libraries in preparation to delete book
 * @param {string} admin_id ID of Authorizing Admin
 * @param {string} book_id ID of book to remove
 * @return {Promise<Object>} Returns the success/fail state and the book_id/error_message
 */

/** admin_get_library
 * Gets a users library
 * @param {string} admin_id
 * @param {string} user_id
 * @return {Promise<Object>} Returns the success/fail state and the book_collection/error_message
 */