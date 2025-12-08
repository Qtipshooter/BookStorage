// books.js
// Quinton Graham
// Book db functions for Book Storage Program

import { mdb_connect } from "./util.js";
import { BS_Error, get_ObjectID, sanitize_book, } from "./util.js";
import { get_level, get_user, get_user_by_id } from "./users.js";

/**
 * Adds a book to the database
 * @param {string} user_id The user adding the book
 * @param {Object} book The data of the book to add
 * @return {Promise<string>} The ID of the newly created book
 * @throws {BS_Error || WriteError || WriteConcernError} Throws if required data is missing, if there is only 
 *   invalid data, if there is a duplicate book, or if there is an error inserting the book
 */
export async function add_book(user_id, book) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const oid = get_ObjectID(user_id);
  if (!oid) { throw new BS_Error(BS_Error.ERR.INVALID_OBJECT, "Invalid User ID"); }
  const user = get_user_by_id(user_id);
  let new_book = sanitize_book(book);

  // Check input params
  if (!user._id) { throw new BS_Error(BS_Error.ERR.UNKNOWN, "Error verifying user ID", user); }
  if (!new_book) { throw new BS_Error(BS_Error.ERR.MISSING_DATA, "No Valid Book Data Supplied"); }
  if (!new_book.title || !new_book.authors) { throw new BS_Error(BS_Error.ERR.MISSING_DATA, "Missing required Book Data (Title or Authors)"); }
  if (duplicate_exists(isbn_10 = new_book.isbn_10, isbn_13 = new_book.isbn_13)) { throw new BS_Error(BS_Error.ERR.DUPLICATE_DATA, "Duplicate ISBN provided"); }

  // Insert Book
  new_book.user_id = oid;
  return books.insertOne(new_book).then((res) => { return res.insertedId; })
}

/** 
 * Updates a book's information.  Overwrites supplied fields, does not touch others
 * @param {string} book_id The ID of the book to update
 * @param {Object} updated_book_values The updated field/value pairs
 * @return {Promise<Object>} Returns the book on success
 * @throws {BS_Error || WriteError || WriteConcernError} Throws if there is invalid data or there is an error inserting the book
 */
export async function update_book(book_id, updated_book_values) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books")
  const sanitized_updates = sanitize_book(updated_book_values);
  let book = await get_book(book_id);

  // Verify request
  if (!sanitized_updates) { throw new BS_Error(BS_Error.ERR.MISSING_DATA, "No Valid Updates Supplied"); }
  if (!book) { throw new BS_Error(BS_Error.ERR.DATA_NOT_FOUND, "Book not Found"); }
  if (await duplicate_exists(isbn_10 = sanitized_updates.isbn_10, isbn_13 = sanitized_updates.isbn_13)) {
    throw new BS_Error(BS_Error.ERR.DUPLICATE_DATA, "Duplicate ISBN supplied");
  }

  // Sanitize anything the sanatizer didn't grab (Other function for user, never update _id)
  delete sanitized_updates._id;
  delete sanitized_updates.user_id;

  // Process updates
  const result = await books.updateOne({ _id: book._id }, { $set: sanitized_updates });
  if (result.modifiedCount > 0) { return get_book(book_id); }
  throw new BS_Error(BS_Error.ERR.UNKNOWN, "No Updates Processed");

}

/**
 * Updates owner for a book to a new user (@todo or blank/default)
 * @param {string} book_id The ID of the book to update
 * @param {string} new_username The username of the new user
 * @return {Promise<>} The updated book
 * @throws {BS_Error || WriteError || WriteConcernError} Throws if the user is invalid or there is an error inserting the book
 */
export async function update_book_owner(book_id, new_username) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const u_id = await get_user(new_username)._id;
  const bo_id = get_ObjectID(book_id);

  // Verify Input
  if (!u_id) { throw new BS_Error(BS_Error.ERR.DATA_NOT_FOUND, "User not Found"); }
  if (!bo_id) { throw new BS_Error(BS_Error.ERR.INVALID_OBJECT, "Invalid Book ID") }

  // Update Book
  let result = await books.updateOne({ _id: bo_id }, { $set: { user_id: u_id } })
  if (result.modifiedCount > 0) { return get_book(book_id); }
  throw new BS_Error(BS_Error.ERR.UNKNOWN, "Error updating book owner", result);
}

/** @todo Add options: delete from all libs, delete only if unattached */
/** 
 * Deletes a book from the database
 * @param {string} book_id The ID of the book to delete
 * @return {Promise<boolean>} true on success, false on failure
 */
export async function delete_book(book_id) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const bo_id = get_ObjectID(book_id);

  /** @todo Check libraries for book **/
  // -> Function call to check for book in libraries
  // -> logic based on option to delete from all

  const result = await books.deleteOne({ _id: bo_id })
  return result.deletedCount > 0;
}

/**
 * Gets book data by supplied ID
 * @param {string} book_id The ID of the book to find
 * @return {Promise<Object>} Book object data or null
 */
export async function get_book(book_id) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");
  const obj_id = get_ObjectID(book_id);

  // Fetch Book
  if (!obj_id) { return null; }
  return books.findOne({ _id: obj_id });
}

/**
 * Fetches a set of books
 * @param {string} [search_term=null] Optional Term to search all fields for
 * @param {string[]} [fields=null] Optional Array of fields to return (all by default)
 * @param {number} [limit=0] Optional Limit of results returned
 * @param {string} [sort_field="title"] Optional the field the results will be sorted on
 * @param {boolean} [ascending=true] Optional Sort direction (ascending by default)
 * @return {Promise<Object>} An array of the books returned from options, or null on no results
 */
export async function get_books(search_term = null, fields = null, limit = 0, sort_field = "title", ascending = true) {
  // Init
  const db = await mdb_connect();
  const books = await db.collection("books");
  const book_fields = [
    "title",
    "user_id",
    "authors",
    "genres",
    "description",
    "isbn_10",
    "isbn_13",
  ];
  let find_options = { projection: {}, limit: 0 };
  let sort_options = {};
  let query = {};

  // Apply Search
  if (search_term && typeof search_term == "string") {
    query = { "$or": [] };
    for (let i = 0; i < book_fields.length; i++) {
      let field_object = {};
      field_object[book_fields[i]] = { "$regex": search_term, "$options": "i" };
      query.$or.push(field_object);
    }
  }

  // Verify/Default options
  if (!(fields instanceof Array)) { fields = book_fields.slice(); }
  for (let i = 0; i < fields.length; i++) { if (book_fields.includes(fields[i])) { find_options.projection[fields[i]] = 1 } }
  if (limit && !(Number(limit) === NaN || Number(limit) < 0)) { find_options.limit = Number(limit); }
  if (!book_fields.includes(sort_field)) { sort_field = "title"; }
  if (ascending) { sort_options[sort_field] = 1; }
  else { sort_options[sort_field] = -1; }

  // Fetch and Return
  const response = await books.find(query, find_options).sort(sort_options).toArray();
  if (!response.length) { return null; }
  return response;

}

/**
 * Checks for duplicate books based on values
 * @param {string} [isbn_10=null] Value to check for duplicates
 * @param {string} [isbn_13=null] Value to check for duplicates
 * @returns {Promise<boolean>} true if there is a duplicate, else false
 */
export async function duplicate_exists(isbn_10 = null, isbn_13 = null) {
  // Init
  const db = await mdb_connect();
  const books = db.collection("books");

  if (typeof isbn_10 == "string") { if (await books.findOne({ isbn_10: isbn_10 })) { return true; } }
  if (typeof isbn_13 == "string") { if (await books.findOne({ isbn_13: isbn_13 })) { return true; } }

  // No Duplicates Found
  return false;
}

/** @todo Advanced Search (by each field) */