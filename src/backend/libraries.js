// libraries.js
// Quinton Graham
// Library db functions for Book Storage program

import { mdb_connect, BS_Error, get_ObjectID } from "./util.js";

get_library(library_id)
get_libraries(user_id)
add_library(user_id, library_details)
update_library(library_id, updates)
delete_library(library_id)
add_to_library(library_id, book_id)
remove_from_library(library_id, book_id)
search_library(library_id, search)
remove_from_all_libraries(book_id)


/**
 * Gets the books in a library by ID
 * @param {string} library_id The ID of the library to fetch
 * @param {number} [limit=0] The number of books to fetch (Default to all)
 * @return {Promise<Object>} The array of books for this library, or null if there is an error fetching them
 */
export async function get_library(library_id, limit = 0) {
  // Init
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const lo_id = get_ObjectID(library_id);
  let agg = [];
  // Verification
  if (!lo_id) { return null; }
  if (!(typeof limit == "number" && limit > 0)) { limit = 0; }

  // Aggregation
  agg.push({ "$match": { "_id": lo_id } });
  agg.push({
    "$lookup": {
      "from": "books",
      "localField": "book_ids",
      "foreignField": "_id",
      "as": "books",
    }
  });
  agg.push({ "$project": { "_id": 0, "books": 1 } });

  // Query
  try {
    const response_data = await libraries.aggregate(agg).toArray();
    if (!response_data.length) { return null; } // No library found
    if (!response_data[0].books.length) { return null; } // No books in library
    return response_data[0].books;
  }
  catch (e) {
    /** @todo Log error information */
    console.log(e);
    return null;
  }
}

/**
 * Gets all the libraries associated with a user
 * @param {string} user_id The user to get the libraries of
 * @return {Promise<Object>} An array of the libraries, or null on failure
 */
export async function get_libraries(user_id) {
  // Init
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const uo_id = get_ObjectID(user_id);
  if (!uo_id) { return null; }
  const filter = { user_id: uo_id };

  // Find and Return
  const result = await find(filter).toArray();
  if (!result.length) { return null; }
  return result;
}

/**
 * Adds a new library for the current user
 * @param {string} user_id The ID of the user for the new library
 * @param {string} title The name of the new library
 * @param {string} [desc=""] Description of the new Library
 * @return {Promise<string>} The id of the newly created library, or null on failure
 */
export async function add_library(user_id, title, desc = "") {
  // Init
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const uo_id = get_ObjectID(user_id);

  // Verification
  if (!uo_id) { return null; }
  if (!title || typeof title != "string") { title = "New Library"; }
  if (desc && typeof desc != "string") { desc = "" }

  // Insert
  try {
    const result = await libraries.insertOne({
      "user_id": uo_id,
      "title": title,
      "description": desc,
    });
    return result.insertedId;
  }
  catch (e) {
    /** @todo Log the error */
    return null;
  }
}

/**
 * Updates details for a library
 * @param {string} library_id The ID of the library to update
 * @param {Object} updates The updates to make (.title and .description)
 * @return {Promise<boolean>} true if updates were processed, else false
 */
export async function update_library(library_id, updates) {
  // Init 
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const lo_id = get_ObjectID(library_id);
  const new_title = updates?.title;
  const new_desc = updates?.description;
  let updates = {}

  // Verification
  if (!lo_id) { return false; }
  if (new_title && typeof new_title == "string") { updates.title = new_title; }
  if (new_desc && typeof new_desc == "string") { updates.description = new_desc; }
  if (!(updates.title || updates.description)) { return false; } // No Updates

  // Process Updates
  const result = await libraries.updateOne({ _id: lo_id }, { "$set": updates });
  return result.modifiedCount > 0;

}

/**
 * Deletes a user's library
 * @param {string} library_id The ID of the library to delete
 * @returns {Promise<boolean>} true on success, false on failure
 */
export async function delete_library(library_id) {
  // Init
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const lo_id = get_ObjectID(library_id);

  if (!lo_id) { return false; }
  const result = await libraries.deleteOne({ _id: lo_id });
  if(result.deletedCount) return true;
  return false; // Library not found/deleted
}

/**
 * -desc-
 * -param-
 * -return-
 * -throw-
 */
export async function add_to_library() { }

/**
 * -desc-
 * -param-
 * -return-
 * -throw-
 */
export async function remove_from_library() { }

/** 
 * -desc-
 * -param-
 * -return-
 * -throw-
 */
export async function search_library() { }

/**
 * -desc-
 * -param-
 * -return-
 * -throw-
 */
export async function remove_from_all_libraries() { }