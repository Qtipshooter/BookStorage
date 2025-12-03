// books.js
// Quinton Graham
// Book db functions for Book Storage Program

import { mdb_connect } from "./util.js";
import { get_level, get_user, get_user_by_id } from "./users.js";
import { BS_Error, get_ObjectID, sanitize_book, } from "./util.js";

/** add_book
 * Add a book to the database
 * @param {string} user_id The user adding the book
 * @param {Object} book The data of the book to add
 * @return {Promise<Object>} The ID of the newly created book
 */
async function add_book(user_id, book) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const oid = get_ObjectID(user_id);
  if (!oid) { throw new BS_Error(BS_Error.ERR.INVALID_OBJECT, "Invalid User ID"); }
  let user;
  let duplicate = null;
  let new_book = sanitize_book(book);

  // Check input params
  try { user = await get_user_by_id(user_id) }
  catch (e) { if (e instanceof BS_Error) { throw e } else { throw new BS_Error(BS_Error.ERR.UNKNOWN, "Error getting user"); } }
  if (!new_book) { throw new BS_Error(BS_Error.ERR.INVALID_FORMAT, "Invalid Book Data Supplied"); }
  new_book.user_id = oid;

  // Verify necessary parameters are included
  if (!new_book.title || !new_book.authors) { throw new BS_Error(BS_Error.ERR.MISSING_DATA, "Missing required Book Data (Title or Authors)"); }

  // Check for duplicate unique identifiers (ISBN)
  if (new_book.isbn_10) {
    duplicate = await books.findOne({ isbn_10: new_book.isbn_10 })
    if (duplicate) { throw new BS_Error(BS_Error.ERR.DUPLICATE_DATA, "Duplicate ISBN-10"); }
  }
  if (new_book.isbn_13) {
    duplicate = await books.findOne({ isbn_13: new_book.isbn_13 })
    if (duplicate) { throw new BS_Error(BS_Error.ERR.DUPLICATE_DATA, "Duplicate ISBN-13"); }
  }

  // Insert book
  try { return await books.insertOne(new_book).then((res) => { return res.insertedId; }) }
  catch (err) { throw new BS_Error(BS_Error.ERR.UNKNOWN, "Error inserting Book"); }
}

/** update_book
 * Updates a book from owner or admin.  Only updates supplied fields, overwrites supplied fields
 * @param {string} user_id The ID of the user updating the book.  Must be owner or admin
 * @param {string} book_id The ID of the book to update
 * @param {Object} updated_book_values The updated field/value pairs
 * @return {Promise<Object>} Returns the updated book count, or error_message on failure
 */
async function update_book(user_id, book_id, updated_book_values) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books")
  const sanitized_updates = sanitize_book(updated_book_values);
  const u_id = get_ObjectID(user_id);
  let book;
  try { book = await get_book(book_id); }
  catch (e) { throw new BS_Error(BS_Error.ERR.DATA_NOT_FOUND, "Book not Found"); }
  const owner = book.user_id;
  let sub_result;

  // Error on invalid params
  if (!(u_id && sanitized_updates)) { throw new BS_Error(BS_Error.ERR.INVALID_FORMAT, "Invalid Parameter(s)"); }

  // Check duplicated Data
  if (sanitized_updates.isbn_10) {
    // TODO Check for duplicate
    let duplicate_found = false;

    try {
      const sub_result = await find_books({ isbn_10: sanitized_updates.isbn_10 });
      if (sub_result.length > 0) { duplicate_found = true; }
    }
    catch (e) { // No Results
      if (!(e instanceof BS_Error)) { throw e; } // TODO: Change function structures more
    }
    if (duplicate_found) { throw new BS_Error(BS_Error.ERR.DUPLICATE_DATA, "Duplicate ISBN Number supplied", sanitized_updates.isbn_10); }
  }
  if (sanitized_updates.isbn_13) {
    // TODO Check for duplicate
    let duplicate_found = false;

    try {
      const sub_result = await find_books({ isbn_13: sanitized_updates.isbn_13 });
      if (sub_result.length > 0) { duplicate_found = true; }
    }
    catch (e) { // No Results
      if (!(e instanceof BS_Error)) { throw e; } // TODO: Change function structures more
    }
    if (duplicate_found) { throw new BS_Error(BS_Error.ERR.DUPLICATE_DATA, "Duplicate ISBN Number supplied", sanitized_updates.isbn_13); }
  }

  // Sanitize anything the sanatizer didn't grab (Other function for user, never update _id)
  delete sanitized_updates._id;
  delete sanitized_updates.user_id;

  // Check user validity of request
  if (!(owner.equals(u_id))) {
    let user_ver = await get_level(user_id);
    if (!(user_ver == "admin")) { throw new BS_Error(BS_Error.ERR.UNAUTHORIZED, "User not authorized to edit this book"); }
  }



  // Process Updates
  const result = await books.updateOne({ _id: book._id }, { $set: sanitized_updates });
  if (result.modifiedCount > 0) { return result.modifiedCount; }
  throw new BS_Error(BS_Error.ERR.UNKNOWN, "No Updates Processed");
}

/** update_book_owner
 * Updates owner from current user to new user or default user/admins only
 * @param {string} book_id The ID of the book to update the owner of
 * @param {string} current_user The owner/admin of the book to authorize
 * @param {string} new_username The new username to update the owner to
 * @return {Promise<Object>}
 */
async function update_book_owner(book_id, current_user, new_username) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  let request_validated = false;
  let new_user;
  try { new_user = await get_user(new_username); }
  catch (e) { throw new BS_Error(BS_Error.ERR.DATA_NOT_FOUND, "Invalid New User"); }
  const new_id = new_user._id;
  let book;
  try { book = await get_book(book_id); }
  catch (e) { throw new BS_Error(BS_Error.ERR.DATA_NOT_FOUND, "Invalid Book"); }
  const bo_id = get_ObjectID(book_id);
  const book_owner = book.user_id;
  let user_level;
  try { user_level = await get_level(current_user); }
  catch (e) { user_level = "user"; }

  // Request Validation
  if (user_level == "admin") { request_validated = true; }
  if (current_user == book_owner) { request_validated = true; }
  if (!request_validated) { throw new BS_Error(BS_Error.ERR.UNAUTHORIZED, "Invalid User, must be book owner or an admin"); }

  // Update Book
  const book_update_result = await books.updateOne({ _id: bo_id }, { $set: { user_id: new_id } });
  if (book_update_result.modifiedCount) { return book_update_result.modifiedCount; }
  throw new BS_Error(BS_Error.ERR.UNKNOWN, "Error updating book owner", {
    new_id: new_id,
    book: book,

  });
}

/** delete_book
 * Deletes a book from db
 * !Constraints -> requestor has to be owner, and book must be in no other collections OR 
 * requestor has to be admin and will delete from all collections.
 * @param {string} user_id The user authorizing the delete (owner/admin)
 * @param {string} book_id The ID of the book to delete
 * @return {Promise<Object>} Returns the deleted count or error_message on failure
 */
async function delete_book(user_id, book_id) {
  // !TODO! Add owner delete own book if it is only in their own library w/ override by admin
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  let book;
  try { book = await get_book(book_id); }
  catch (e) { throw new BS_Error(BS_Error.ERR.DATA_NOT_FOUND, "Book Not Found"); }
  const bo_id = get_ObjectID(book_id);
  let user_level;
  try { user_level = await get_level(user_id); }
  catch (e) { user_level = "user"; }
  const owner = book.user_id;
  const uo_id = get_ObjectID(user_id);

  // Identity Verification
  if (!(owner.equals(uo_id))) {
    if (!(user_level == "admin")) {
      throw new BS_Error(BS_Error.ERR.UNAUTHORIZED);
    }
  }

  // Delete
  const result = await books.deleteOne({ _id: bo_id });
  if (result.deletedCount > 0) { return result.deletedCount; }
  throw new BS_Error(BS_Error.ERR.UNKNOWN, "No Books Deleted");
}

/** get_book
 * Gets book data by supplied ID
 * @param {string} book_id The ID of the book to find
 * @return {Promise<Object>} Book object data or error_message on failure
 */
async function get_book(book_id) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const obj_id = get_ObjectID(book_id);

  // Verify ID
  if (!obj_id) { throw new BS_Error(BS_Error.ERR.INVALID_OBJECT, "Invalid Book ID"); }

  // Get Book
  const book = await books.findOne({ _id: obj_id });
  if (book) { return book; }
  throw new BS_Error(BS_Error.ERR.DATA_NOT_FOUND);
}

/** get_books
 * Gets all the books in the database
 * @param {string[]} [fields = null] Fields to return (Null for all)
 * @param {number} limit Limit of results to return (0 for no limit)
 * @param {string} sort_field Name of field to sort by (title by default)
 * @param {boolean} ascending Sorting ascending or descending (ascending by default)
 * @return {Promise<Object>} An array of all the book data returned with options selected, or error_message on failure
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
  if (!fields) { fields = ["all"]; }
  if (fields && !(fields instanceof Array)) { throw new BS_Error(BS_Error.ERR.INVALID_FORMAT, "Invalid fields format applied"); }
  else if (fields.includes("all")) { fields = book_fields.slice(); }
  if (limit && (Number(limit) == NaN || Number(limit < 0))) { throw new BS_Error(BS_Error.ERR.INVALID_FORMAT, "Invalid limit supplied"); }
  if (!book_fields.includes(sort_field)) { sort_field = "title"; }
  if (ascending) { sort_option[sort_field] = 1; }
  else { sort_option[sort_field] = -1; } // Descending

  // Parse Data
  for (let i = 0; i < fields.length; i++) {
    if (book_fields.includes(fields[i])) { find_options.projection[fields[i]] = 1; }
  }
  find_options.limit = limit;


  // Fetch Data
  const response = await books.find({}, find_options).sort(sort_option).toArray();
  if (!response.length) { throw new BS_Error(BS_Error.ERR.DATA_NOT_FOUND, "No Results", response); }

  // Return payload
  return response
}

/** search_books
 * Simple search based on one search term looking through all available fields
 * @param {string} search_term String of term to search through database for
 * @return {Promise<Object>} Cursor to all books matching the search term, or error_message on failure
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

  // Verify Search Term
  if (!(typeof search_term === "string")) { throw new BS_Error(BS_Error.ERR.INVALID_FORMAT, "Search term is not a string"); }

  // Build Query
  for (let i = 0; i < book_fields.length; i++) {
    let field_object = {}
    field_object[book_fields[i]] = {
      "$regex": search_term,
      "$options": "i"
    }
    query.$or.push(field_object);
  }

  // Find matching books
  const response = await books.find(query).toArray();
  if (!response.length) { throw new BS_Error(BS_Error.ERR.DATA_NOT_FOUND, "No Results Found"); }

  // Return payload
  return response;
}

/** find_books
 * Finds book based on specific fields being searched
 * @param {Object} search_book Book formated like an updated_book_values object
 * @param {boolean} [exact=false] Only exact matches on given fields
 * @return {Promise<Object>} Cursor to all books matching the search term, or error_message on failure
 */
async function find_books(search_book, exact = false) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books")
  const sanitized_book = sanitize_book(search_book);
  if (!sanitized_book) { throw new BS_Error(BS_Error.ERR.INVALID_FORMAT, "Invalid search book"); }

  if (!exact) {
    for (const key in sanitized_book) {
      sanitized_book[key] = RegExp(sanitized_book[key], "i");
    }
  }

  const response = await books.find(sanitized_book).toArray();

  return response;
}

export { add_book, update_book, update_book_owner, delete_book, get_book, search_books, get_books }