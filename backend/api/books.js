// books.js
// Quinton Graham
// Book db functions for Book Storage Program

import { mdb_connect } from "../util/db_connection.js";
import { check_level, get_user, get_user_by_id } from "./users.js";
import { get_data, ERR, failure, get_ObjectID, sanitize_book, success } from "./util.js";

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
  if (!oid) { return failure(ERR.INVALID_OBJECT, "Invalid User ID"); }
  const user = await get_user_by_id(user_id);
  let duplicate = null;
  let new_book = sanitize_book(book);

  // Check input params
  if (!user.success) { return failure(user.error_code, user.error_message, user_id); }
  if (!new_book) { return failure(ERR.INVALID_FORMAT, "Invalid Book Data Supplied"); }
  new_book.user_id = oid;

  // Verify necessary parameters are included
  if (!new_book.title || !new_book.authors) { return failure(ERR.MISSING_DATA, "Missing required Book Data (Title or Authors)"); }

  // Check for duplicate unique identifiers (ISBN)
  if (new_book.isbn_10) {
    duplicate = await books.findOne({ isbn_10: new_book.isbn_10 })
    if (duplicate) { return failure(ERR.DUPLICATE_DATA, "Duplicate ISBN-10"); }
  }
  if (new_book.isbn_13) {
    duplicate = await books.findOne({ isbn_13: new_book.isbn_13 })
    if (duplicate) { return failure(ERR.DUPLICATE_DATA, "Duplicate ISBN-13"); }
  }

  // Insert book
  try { return success(await books.insertOne(new_book).then((res) => { return res.insertedId; })) }
  catch (err) { return failure(ERR.UNKNOWN, "Error inserting Book"); }
}

/** update_book
 * Updates a book from owner or admin.  Only updates supplied fields, overwrites supplied fields
 * @param {string} user_id
 * @param {string} book_id
 * @param {Object} updated_book_values
 * @return {Promise<Object>}
 */
async function update_book(user_id, book_id, updated_book_values) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books")
  const sanitized_updates = sanitize_book(updated_book_values);
  const u_id = get_ObjectID(user_id);
  const book = get_data(await get_book(book_id));
  if (!book) { return failure(ERR.DATA_NOT_FOUND, "Book not Found"); }
  const owner = book.user_id;

  // Error on invalid params
  if (!(u_id && sanitized_updates)) { return failure(ERR.INVALID_FORMAT, "Invalid Parameter(s)"); }

  // Sanitize anything the sanatizer didn't grab (Other function for user, never update _id)
  delete sanitized_updates._id;
  delete sanitized_updates.user_id;

  // Check user validity of request
  if (!(owner == u_id)) {
    let user_ver = get_data(await check_level(user_id));
    if (!(user_ver == "admin")) { return failure(ERR.UNAUTHORIZED, "User not authorized to edit this book"); }
  }

  // Process Updates
  const result = await books.updateOne({ _id: bo_id }, sanitized_updates);
  if (result.modifiedCount > 0) { return success(result.modifiedCount); }
  return failure(ERR.UNKNOWN, "No Updates Processed");
}

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
  const request_validated = false;
  const new_user = get_data(await get_user(new_username));
  if (!new_user) { return failure(ERR.DATA_NOT_FOUND, "Invalid New User"); }
  const new_id = new_user._id;
  const book = get_data(await get_book(book_id));
  if (!book) { return failure(ERR.DATA_NOT_FOUND, "Invalid Book"); }
  const book_owner = book.user_id;
  const user_level = get_data(await check_level(current_user));

  // Request Validation
  if (user_level == "admin") { request_validated = true; }
  if (current_user == book_owner) { request_validated = true; }
  if (!request_validated) { return failure(ERR.UNAUTHORIZED, "Invalid User, must be book owner or an admin"); }

  // Update Book
  const book_update_result = await books.updateOne({ _id: get_ObjectID(book) }, { $set: { user_id: new_id } });
  if (book_update_result.modifiedCount) { return success(book_update_result.modifiedCount); }
  return failure(ERR.UNKNOWN, "Error updating book owner");
}

/** delete_book
 * Deletes a book from db
 * !Constraints -> requestor has to be owner, and book must be in no other collections OR 
 * requestor has to be admin and will delete from all collections.
 * @param {string} user_id
 * @param {string} book_id
 * @return {Promise<Object>}
 */
async function delete_book(user_id, book_id) {
  // !TODO! Add owner delete own book if it is only in their own library w/ override by admin
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const book = get_data(await get_book(book_id));
  if (!book) { return failure(ERR.DATA_NOT_FOUND, "Book Not Found"); }
  const user_level = get_data(await check_level(user_id));
  const owner = book.user_id;

  // Identity Verification
  if (!(user_level == "admin")) { return failure(ERR.UNAUTHORIZED); }

  // Delete
  const result = await books.deleteOne({ _id: bo_id });
  if (result.deletedCount > 0) { return success(result.deletedCount); }
  return failure(ERR.UNKNOWN, "No Books Deleted");
}

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
  if (!obj_id) { return failure(ERR.INVALID_OBJECT, "Invalid Book ID"); }

  // Get Book
  const book = await books.findOne({ _id: obj_id });
  if (book) { return success(book); }
  return failure(ERR.DATA_NOT_FOUND);
}

/** get_books
 * Gets all the books in the database
 * @param {string[]} [fields = null] Fields to return
 * @param {number} limit - Limit of results to return
 * @param {string} sort_field - Name of field to sort by (checked in function)
 * @param {boolean} ascending - Sorting ascending or descending
 * @return {Promise<Object>}
 */
async function get_books(fields = null, limit = 0, sort_field = "title", ascending = true) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const book_fields = [
    "title",
    "authors",
    "genres",
    "description",
    "isbn_10",
    "isbn_13",
  ]
  let find_options = { projection: { _id: 1 }, limit: 0 }
  let sort_option = {}

  // Verify data or default
  if (fields && !(fields instanceof Array)) { return failure(ERR.INVALID_FORMAT, "Invalid fields format applied"); }
  if (limit && (Number(limit) == NaN || Number(limit < 0))) { return failure(ERR.INVALID_FORMAT, "Invalid limit supplied"); }
  if (!book_fields.includes(sort_field)) { sort_field = "title"; }
  if (ascending) { sort_option[sort_field] = 1; }
  else { sort_option[sort_field] = -1; } // Descending

  // Parse Data
  for (let i = 0; i < fields.length; i++) {
    if (book_fields.includes(fields[i])) { find_options.projection[fields[i]] = 1; }
  }
  find_options.limit = limit;


  // Fetch Data
  const result_count = await books.countDocuments({}, find_options.limit);
  const response = await books.find({}, find_options).sort(sort_option);

  // Return payload
  return success({
    document_count: result_count,
    cursor: response
  })
}

/** search_books
 * Simple search based on one search term looking through all available fields
 * @param {Object} search_term
 * @return {Promise<Object>}
 */
async function search_books(search_term) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const book_fields = [
    "title",
    "authors",
    "genres",
    "description",
    "isbn_10",
    "isbn_13",
  ]
  let query = { "$or": [] };
  let response = {};

  // Verify Search Term
  if (!(typeof search_term === "string")) { return failure(ERR.INVALID_FORMAT, "Search term is not a string"); }

  // Build Query
  for (let i = 0; i < book_fields.length; i++) {
    let field_object = {}
    field_object[book_fields[i]] = {
      "$regex": search_term,
      "$options": "i"
    }
    query.$or.push(field_object);
  }

  // Count of books before getting a cursor for the books
  response.document_count = await books.countDocuments(query);
  if (response.document_count == 0) { return failure(ERR.DATA_NOT_FOUND); }


  // Find matching books
  response.cursor = await books.find(query, function (err, doc) {
    console.log(doc.length);
  });

  // Return payload
  return success(response);
}

export { add_book, update_book, update_book_owner, delete_book, get_book, search_books, get_books }