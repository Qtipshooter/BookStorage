// users.js
// Quinton Graham
// Handles user functions for the Book Storage Program

import { BS_Error, get_ObjectID, mdb_connect, } from "./util.js";

/**
 * Adds a new user and initializes their account.
 * @param {string} username The username for the new user
 * @param {string} email The email to be associated with the account
 * @param {string} password The password to sign up with
 * @return {Promise<Object>} On successful registration, returns the created user object, otherwise returns an error object
 */
export async function register_user(username, email, password) {
  // Init
  const username_regex = /^\w{3,64}$/i; // Username -> 3-64 alphanumeric characters, underscores yes spaces no
  const email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // Email -> accepts any valid email (and maybe some invalid ones too :P)
  const pass_regex = /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/; // Password -> 8-128 with a character and number assertation
  const db = await mdb_connect(); // Database connection
  const users = db.collection("users"); // User table
  const c_date = new Date(); // Creation Timestamp
  const hash_passes = 12;
  let user_id;

  // Legal entry checks
  if (!username.match(username_regex)) { return { error: "Username contains illegal characters or length is invalid" }; }
  if (!email.match(email_regex)) { return { error: "Email is invalid" }; }
  if (!password.match(pass_regex)) { return { error: "Password does not meet length or complexity requirements" }; }

  // Already in use checks
  if (await users.findOne({ username: username.toLowerCase() })) { return { error: "Username in use" } }
  if (await users.findOne({ email: email.toLowerCase() })) { return { error: "Email in use" } }

  // Checks complete, insert
  // NOTE TO SELF: Display name is stored seperately due to the size concern 
  // being less than the performance concern when searching at scale.
  const passhash = await bcrypt.hash(password, hash_passes);
  try {
    user_id = await users.insertOne({
      display_name: username,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      hashcode: passhash,
      created_date: c_date,
      level: "user"
    }).then((res) => {
      return res.insertedId;
    })
  }
  catch (e) {
    console.log("Error registering user: " + e.message);
    return { error: "Server error while registering user" }
  }

  // Success Payload
  return {
    _id: user_id.toHexString(),
    display_name: username,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    level: "user",
  };
}

/**
 * Checks the user level (admin/user/etc.)
 * @param {string} user_id The id of the user to check
 * @return {Promise<string>} If found, the level of the user, otherwise null
 * @throws {BS_Error} Throws BS_Error if user_id is an invalid format
 * @todo Change to not throw and instead log with logging function
 */
export async function get_level(user_id) {
  // Init
  const db = await mdb_connect();
  const users = db.collection("users");
  const ob_id = get_ObjectID(user_id);

  // Verification
  if (!ob_id) { throw new BS_Error(BS_Error.ERR.INVALID_OBJECT); }

  // Fetch and return
  return await users.findOne({ _id: ob_id }).then((res) => {
    if (res) { return res.level; }
    return null;
  });
}

/**
 * Gets a user object by their username or email
 * @param {string} username The username or email of the user to get info for
 * @return {Promise<Object>} On success, the user object, on failure, error message
 */
export async function get_user(username) {
  // Init
  if (typeof username != "string") { return { error: "Username must be a string" } }
  const is_email = username.indexOf("@") > 0; // Check if email
  const db = await mdb_connect(); // DB Con
  const users = db.collection("users"); // User table
  const proj = { hashcode: 0, } // Projection to exclude pass-hashes
  const user = null;

  // Find the User
  if (is_email) { user = await users.findOne({ email: username.toLowerCase() }, { projection: proj }) }
  else { user = await users.findOne({ username: username.toLowerCase() }, { projection: proj }) }

  if (!user) { user = { error: "User not found" } }
  return user;
}

/**
 * Gets a user object by their ID
 * @param {string} user_id The user id to search for
 * @return {Promise<Object>} On success, the user object, on failure, error message
 */
export async function get_user_by_id(user_id) {
  // Init
  const db = mdb_connect();
  const users = db.collection("users");
  const proj = { hashcode: 0 };
  const user_oid = get_ObjectID(user_id);

  if (!user_oid) { return { error: "Invalid User ID" } }

  // Find the User
  const user = await users.findOne({ _id: user_oid }, { projection: proj });
  if (user) { return user }
  return { error: "User not Found" }
}

/**
 * Gets all users in database with optional parameters.  Use result.length to verify return is not error.
 * @param // Todo
 * @return {Promise<Object>} An array of the users found, or null on failure
 */
export async function get_users() {
  // Init
  const db = mdb_connect();
  const users = db.collection("users");
  const proj = { hashcode: 0 };

  // Fetch Users
  const user_col = await users.find({}, { projection: proj }).toArray();

  if (user_col.length) { return user_col }
  return null;
}

/**
 * Removes a user account
 * @param {string} user_id The user ID of the account to delete
 * @return {Promise<boolean>} True on normal operation, false on invalid param, invalid user, or other db errors
 * @todo Need to add functionality of deleting the libraries associated with user
 * @todo Need to add removal of user from all associated books or annonmize the information
 * @todo Convert console logs to logging program
 */
export async function remove_user(user_id) {
  // Init
  const db = await mdb_connect();
  const users = db.collection("users");
  const obj_id = get_ObjectID(user_id);
  if (!obj_id) { return false; } // Invalid ID

  //
  const result = await users.deleteOne({ _id: obj_id });
  if (result.acknowledged) { return true; }
  console.log("Error deleting account with ID: " + user_id);
  return false;
}

/**
 * Verifies login information and gets data for login if valid
 * @param {string} username The username or email of the user to check
 * @param {string} password The cleartext password of the user
 * @return {Promise<Object>} On success, the user object, on failure, error message
 */
export async function authorize_user(username, password) {
  // Verify input
  if (typeof username !== "string" || typeof password != "string") {
    return { error: "Username/Password must be supplied as strings" }
  }

  // Init
  const isEmail = username.indexOf("@") > 0; // Check if email
  const db = await mdb_connect(); // DB Con
  const users = db.collection("users"); // User Table
  let user; // User object to return
  let authenticated = false; // Auth Status

  // Get User
  if (isEmail) { user = await users.findOne({ email: username }); }
  else { user = await users.findOne({ username: username.toLowerCase() }); }

  // Check Hash
  if (user) { authenticated = await bcrypt.compare(password, user.hashcode); }
  else { return { error: "User Not Found" } }

  // Return payload
  if (authenticated) {
    return {
      _id: user._id,
      display_name: user.display_name,
      username: user.username,
      email: user.email,
      level: user.level,
    };
  }
  return { error: "Invalid Password" };
}
