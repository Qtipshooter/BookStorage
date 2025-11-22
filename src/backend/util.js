// util.js
// Quinton Graham
// Utility functions for Book Storage Program

import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

/** DB Setup information **/
const envpath = `.env${process.env.NODE_ENV ? "." + process.env.NODE_ENV : ""}`;
dotenv.config({ path: envpath })
const connection_string = process.env.CONNECTION_STRING + process.env.DATABASE_NAME;
const client = new MongoClient(connection_string);
let db_connection = null;

/** Error Setup Information **/
class BS_Error extends Error {

  // Defaults
  name = "BS_Error";
  error_code = 800;
  message = "Unknown Error";
  error_data = null;
  timestamp = null;

  static ERR = {
    "UNKNOWN": 800,
    "UNAUTHORIZED": 801,
    "DUPLICATE_DATA": 802,
    "INVALID_OBJECT": 803,
    "DATA_NOT_FOUND": 804,
    "INVALID_FORMAT": 805,
    "MISSING_DATA": 806
  };

  static error_messages = new Map([
    [800, "Unknown Error"],
    [801, "User is not authorized to perform this action"],
    [802, "Duplicate Unique Identifier supplied"],
    [803, "Invalid Object ID"],
    [804, "No Results"],
    [805, "Invalid Format"],
    [806, "Missing required data"],
  ]);

  /**
   * Creates an instance of BS_Error to be thrown.
   * @param {number} error_code The Error code number identifier, referenced from BS_Error.ERR
   * @param {string} message Custom Error Message.  If blank, uses default based on error_code.
   * @param {any} error_data Any Data to be supplied for the error
   * @param  {...any} params Error class params
   */
  constructor(error_code = 800, message = null, error_data = null, ...params) {
    super(params);
    if (BS_Error.error_messages.get(Number(error_code))) { this.error_code = Number(error_code); }
    if (message) { this.message = String(message); }
    else { this.message = BS_Error.error_messages.get(this.error_code); }
    if (error_data) { this.error_data = error_data; }
    this.timestamp = new Date();
  }
}

/** Util Functions **/
/** mdb_connect
 * Establishes the connection if not active, and returns the instance.  If active, returns active instance
 * @returns {Db} A Database instance for MongoDB
 */
async function mdb_connect() {
  let con_tries = 0;
  if (!db_connection) {
    while (con_tries < 5) {
      con_tries++;
      try {
        console.log("DB Connection attempt #" + con_tries);
        await client.connect();
        db_connection = client.db('');
        console.log("Connected to DB");
        return db_connection;
      }
      catch (err) {
        console.log("Attempt #" + con_tries + " Failed. . .");
      }
    }
    // Attempts failed, crash
    console.log("Attempts to connect to database failed, throwing . . .");
    throw new Error("Cannot Connect to MongoDB");
  }
  return db_connection;
}

/** get_ObjectID
 * Converts strings to ObjectIDs for mongodb
 * @param {string} o_id ObjectID to be converted from string 
 * @returns {ObjectID | null} ObjectID on success and null of failure (easy to check)
 */
function get_ObjectID(o_id) {
  try {
    if (o_id instanceof ObjectId) { return o_id; }
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
 * @param {Object} original_book Original book data supplied
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

/** success
 * Shorthand return for success objects
 * @param {any} data Whatever data will be returned in the success object
 * @return {Object} A success object with success = true and data = data
 */
function success(data) {
  return {
    success: true,
    data: data
  }
}

/** failure
 * Shorthand return for failure objects
 * @param {number} error_code Error Code from ERR Array (Reset to ERR.UNKNOWN on unknown code)
 * @param {string} [error_message] The Error to display on failure (default to message provided by error code)
 * @param {any} [error_data] Error data for debugging or troubleshooting
 * @return {Object}
 */
function failure(error_code, custom_error_message = null, error_data = null) {
  // Response Object Init
  let res = {
    success: false,
    error_code: ERR.UNKNOWN,
    error_message: error_messages.get(error_messages.get(ERR.UNKNOWN)),
  }

  // Param Verification
  if (error_messages.get(Number(error_code))) { res.error_code = Number(error_code); }
  if (custom_error_message) { res.error_message = String(custom_error_message); }
  else { res.error_message = error_messages.get(res.error_code); }
  if (error_data) { res.error_data = error_data; }

  return res;
}

/** get_data
 * Checks an object for positive on success, and returns null if not.  Returns data directly if successful
 * Allows the following: api_data = get_data(await api_call()) rather than then chaining
 * @param {Object} success_object Object returned by internal functions
 * @return {any | null} success_object.data or null if unsuccessful
 */
function get_data(success_object) {
  if (success_object.success) { return success_object.data; }
  return null;
}

export {
  BS_Error,
  mdb_connect,
  get_ObjectID,
  sanitize_book,
  success,
  failure,
  get_data,
}