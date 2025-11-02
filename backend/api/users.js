import dotenv from "dotenv"
import { mdb_connect } from "../util/db_connection.js";
import bcrypt from "bcrypt";
import { ERR, failure, get_ObjectID, success } from "./util.js";
const envpath = `.env${process.env.NODE_ENV || ""}`;
dotenv.config({ path: envpath })

// ------ User Functions ------ //
/** register_user
 * Performs first time registration for a user, including setting up their user account and
 * their data in the library db.
 * @param {string} username Username to register account with
 * @param {string} email Email to register account with
 * @param {string} password Clear password to resiter account with
 * @return {Promise<Object>} On success, the id of the newly created user, on failure, error_message
 */
async function register_user(username, email, password) {
  // Init
  const username_regex = /^\w{3,64}$/i; // Username -> 3-64 alphanumeric characters, underscores yes spaces no
  const email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // Email -> accepts any valid email (and maybe some invalid ones too :P)
  const pass_regex = /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/; // Password -> 8-128 with a character and number assertation
  const db = await mdb_connect(); // Database connection
  const users = db.collection("users"); // User table
  const libraries = db.collection("libraries"); // Library Table
  let err_msg = ""; // Return message in payload on error
  let invalid_registration = false; // For checking to send back invalid response
  const c_date = new Date(); // Creation Timestamp

  // Legal entry checks
  if (!username.match(username_regex)) { err_msg = "Username contains illegal characters or length is invalid"; invalid_registration = true; }
  if (!email.match(email_regex)) { err_msg = "Email is invalid"; invalid_registration = true; }
  if (!password.match(pass_regex)) { err_msg = "Password does not meet length or complexity requirements"; invalid_registration = true; }

  if (invalid_registration) { return failure(ERR.INVALID_FORMAT, err_msg); }

  // Already in use checks
  if (await users.findOne({ username: username.toLowerCase() })) { err_msg = "Username in use"; invalid_registration = true; }
  if (await users.findOne({ email: email.toLowerCase() })) { err_msg = "Email in use"; invalid_registration = true; }

  // Response is illegal, Return
  if (invalid_registration) { return failure(ERR.DUPLICATE_DATA, err_msg); }

  // Checks complete, insert
  // NOTE TO SELF: Display name is stored seperately due to the size concern 
  // being less than the performance concern when searching at scale.
  const passhash = await bcrypt.hash(password, Number(process.env.HASH_PASSES));
  const user_id = await users.insertOne({
    display_name: username,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    hashcode: passhash,
    created_date: c_date,
    level: "user"
  }).then((res) => {
    return res.insertedId;
  })

  libraries.insertOne({ user_id: user_id })

  // Success Payload
  return success(user_id);
}

/** get_level
 * Checks the user level (admin/user/etc.)
 * @param {string} user_id The id of the user to check
 * @return {Promise<Object>} If found, the level of the user, otherwise error_message
 */
async function get_level(user_id) {
  // Init
  const db = await mdb_connect();
  const users = db.collection("users");
  const ob_id = get_ObjectID(user_id);

  // Verification
  if (!ob_id) { return failure(ERR.INVALID_OBJECT); }

  // Fetch
  const level = await users.findOne({ _id: ob_id }).then((res) => {
    if (res) {
      return res.level;
    }
    return res;
  })

  // Results
  if (level) { return success(level); }
  return failure(ERR.DATA_NOT_FOUND);
}

//TODO update the return to have object rather than just id
/** authorize_user
 * Verifies login information
 * @param {string} username The username or email of the user to check
 * @param {string} password The cleartext password of the user
 * @return {Promise<Object>} On success, the user object, on failure, error_message
 */
async function authorize_user(username, password) {
  // Init
  if (typeof username !== "string" || typeof password != "string") { return failure(ERR.INVALID_FORMAT, "Username/Password must be supplied as strings"); }
  const isEmail = username.indexOf("@") > 0; // Check if email
  const db = await mdb_connect(); // DB Con
  const users = db.collection("users"); // User Table
  let user;
  let authenticated = false;

  // Get User
  if (isEmail) { user = await users.findOne({ email: username }); }
  else { user = await users.findOne({ username: username.toLowerCase() }); }

  // Check Hash
  if (user) { authenticated = await bcrypt.compare(password, user.hashcode); }
  else { return failure(ERR.DATA_NOT_FOUND, "User not found"); }

  // Return payload
  if (authenticated) { return success(user._id.toString()); }
  return failure(ERR.UNAUTHORIZED, "Invalid Password");
}

/** get_user
 * Gets basic user information
 * @param {string} username The username or email of the user to get info for
 * @return {Promise<Object>} On success, the user object, on failure, error_message
 */
async function get_user(username) {
  // Init
  if (typeof username !== "string") { return failure(ERR.INVALID_FORMAT, "Username/Email is not a string"); }
  const isEmail = username.indexOf("@") > 0; // Check if email
  const db = await mdb_connect(); // DB Con
  const users = db.collection("users"); // User table
  const proj = { hashcode: 0, } // Projection to exclude pass-hashes
  let user = null; // User object, not directly returned so that we have the success state

  // Find the User
  if (isEmail) { user = await users.findOne({ email: username.toLowerCase() }, { projection: proj }) }
  else { user = await users.findOne({ username: username.toLowerCase() }, { projection: proj }) }

  // Return Payload
  if (user) { return success(user); }
  return failure(ERR.DATA_NOT_FOUND, "User Not Found");
}

/** get_user_by_id
 * Gets basic user information
 * @param {string} user_id The ID of the user to get info for
 * @return {Promise<Object>} On success, the user object, on failure, error_message
 */
async function get_user_by_id(user_id) {
  // Init
  const db = await mdb_connect(); // DB Con
  const users = db.collection("users"); // User table
  const proj = { hashcode: 0, } // Projection to exclude pass-hashes
  const user_oid = get_ObjectID(user_id);
  let user = null; // User object, not directly returned so that we have the success state

  // Find the User
  if (user_oid) { user = await users.findOne({ _id: user_oid }, { projection: proj }); }
  else { return failure(ERR.INVALID_OBJECT); }

  // Return Payload
  if (user) { return success(user); }
  return failure(ERR.DATA_NOT_FOUND, "User Not Found");
}

/** get_users
 * Gets basic user information for all users (administrative)
 * @return {Promise<Object>} Returns an array of all the users
 */
async function get_users() {
  // Init
  const db = await mdb_connect(); // DB Con
  const users = db.collection("users"); // User table
  const proj = { hashcode: 0, } // Projection to exclude pass-hashes

  // Fetch users
  const user_col = await users.find({}, { projection: { hashcode: 0 } }).toArray();

  // Return Payload
  if (user_col) { return success(user_col); }
  return failure(ERR.UNKNOWN);
}

//TODO Implement anonymizing
/** remove_user
 * Removes user from database and anonymizes or deletes connected data
 * @param {string} user_id ID of the user to remove
 * @return {Promise<Object>} Returns the id of removed user, or error_message on failure
 */
async function remove_user(user_id) {
  // Init
  const db = await mdb_connect();
  const users = db.collection("users");
  const obj_id = get_ObjectID(user_id);
  if (!obj_id) { return failure(ERR.INVALID_OBJECT); }

  // TODO Anonymize data once other endpoints are created

  // Removal from database
  const result = await users.deleteOne({ _id: obj_id });

  if (result.acknowledged) {
    if (result.deletedCount) { return success(user_id); }
    else { return failure(ERR.DATA_NOT_FOUND, "No Matching Users"); }
  }
  return failure(ERR.UNKNOWN);
}

export {
  register_user,
  get_level,
  get_user,
  get_user_by_id,
  get_users,
  remove_user,
  authorize_user,
}