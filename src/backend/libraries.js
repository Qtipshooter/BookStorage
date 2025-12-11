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
  return result.deletedCount ? true : false;
}

/**
 * Adds a book to the library
 * @param {string} library_id The library to add to
 * @param {string} book_id The book to add
 * @return {Promise<boolean>} True if book was added, false otherwise (typically already exists)
 */
export async function add_to_library(library_id, book_id) {
  // Init
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const lo_id = get_ObjectID(library_id);
  const bo_id = get_ObjectID(book_id);

  // Verifications
  if (!(lo_id && bo_id)) { return false; } // Invalid syntax
  if (!(await libraries.findOne({ _id: lo_id }) && await books.findOne({ _id: bo_id }))) { return false; } // Library or book does not exist
  if (await libraries.findOne({ _id: lo_id, book_ids: bo_id })) { return false; } // Duplicate

  // Add Book
  const result = await libraries.updateOne({ _id: lo_id }, { "$push": { book_ids: bo_id } });
  return result.modifiedCount ? true : false;

}

/**
 * Removes a book from a library
 * @param {string} library_id The library to remove from
 * @param {string} book_id The book to remove
 * @return {Promise<boolean>} True on success, else false
 */
export async function remove_from_library(library_id, book_id) {
  // Init
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const lo_id = get_ObjectID(library_id);
  const bo_id = get_ObjectID(book_id);

  // Verifications
  if (!(lo_id && bo_id)) { return false; }
  if (!(await libraries.findOne({ _id: lo_id }))) { return false; }

  // Removal and Return
  const result = await libraries.updateOne({ _id: lo_id }, { "$pull": { book_ids: bo_id } });
  return result.modifiedCount ? true : false;

}

/** @todo Options for length, etc. */
/** 
 * Searches a library for a book containing the text provided
 * @param {string} library_id The library to search
 * @param {string} search_term The term to search for
 * @return {Promise<Object>} An array containing the returned books, null on no results
 */
export async function search_library(library_id, search_term) {
  // Init
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const lo_id = get_ObjectID(library_id);

  // Verifications
  if (typeof search_term != "string") { return null; }
  if (!lo_id) { return null; }

  // Agg
  const agg = [
    {
      $match: { _id: lo_id }
    },
    {
      $lookup: {
        from: "books",
        localField: "book_ids",
        foreignField: "_id",
        as: "books",
      }
    },
    {
      $project: {
        books: 1,
        _id: 0
      }
    },
    {
      $unwind: "books",
    },
    {
      $replaceRoot: { newRoot: "books" },
    },
    {
      $match: {
        $or: {
          "title": {
            $regex: search_term,
            $options: "i",
          },
          "authors": {
            $regex: search_term,
            $options: "i",
          },
          "genres": {
            $regex: search_term,
            $options: "i",
          },
          "description": {
            $regex: search_term,
            $options: "i",
          },
          "isbn_10": {
            $regex: search_term,
            $options: "i",
          },
          "isbn_13": {
            $regex: search_term,
            $options: "i",
          },
        }

      }
    },
  ]

  // Search and Return
  const results = libraries.aggregate(agg).toArray();
  if (!results.length) { return null; }
  return results;
}

/**
 * Removes a book from all libraries containing it
 * @param {string} book_id The ID of the book to remove
 * @return {Promise<boolean>} True upon completion, or false on an error
 */
export async function remove_from_all_libraries(book_id) {
  // Init
  const db = await mdb_connect();
  const libraries = db.collection("libraries");
  const bo_id = get_ObjectID(book_id);
  if (!bo_id) { return null; }

  // Deletion
  const result = await libraries.updateMany({ book_ids: bo_id }, { $pull: { book_ids: bo_id } });
  if (result.matchedCount == result.modifiedCount) { return true; }
  return false;
}