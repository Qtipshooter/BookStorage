// util.js
// Quinton Graham
// Utility functions for Book Storage Program

import { ObjectId } from "mongodb";

/** get_ObjectID
 * Converts strings to ObjectIDs for mongodb
 * @param {string} o_id ObjectID to be converted from string 
 * @returns {ObjectID | null} ObjectID on success and null of failure
 */
function get_ObjectID(o_id) {
  try {
    return ObjectId.createFromHexString(o_id);
  }
  catch (err) {
    return null;
  }
}

export {
  get_ObjectID,
}