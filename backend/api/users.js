import { ObjectId } from "bson";
import { mdb_connect } from "../util/db_connection.js";
import bcrypt from "bcrypt";

// ------ User Functions ------ //
/** register_user
 * Registers a User and then logs in session
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @return {Promise<Object>}
 */
async function register_user(username, email, password) {
  // Init
  const username_regex = /^\w{3,64}$/i; // Username -> 3-64 alphanumeric characters, underscores yes spaces no
  const email_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // Email -> accepts any valid email (and maybe some invalid ones too :P)
  const pass_regex = /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/; // Password -> 8-128 with a character and number assertation
  const db = await mdb_connect(); // Database connection
  const users = db.collection("users"); // User table
  let err_msg = ""; // Return message in payload on error
  let invalid_registration = false; // For checking to send back invalid response
  const c_date = new Date(); // Creation Timestamp
  
  // Legal entry checks
  if (!username.match(username_regex)) { err_msg = "Username contains illegal characters or length is invalid"; invalid_registration = true; }
  if (!email.match(email_regex)) { err_msg = "Email is invalid"; invalid_registration = true; }
  if (!password.match(pass_regex)) { err_msg = "Password does not meet length or complexity requirements"; invalid_registration = true; }

  // Already in use checks
  if (await users.findOne({username: username.toLowerCase()})) { err_msg = "Username in use"; invalid_registration = true;}
  if (await users.findOne({primary_email: email.toLowerCase()})) { err_msg = "Email in use"; invalid_registration = true;}

  // Response is illegal, Return
  if (invalid_registration) {
    return {
      success: false,
      error_message: err_msg,
    }
  }

  // Checks complete, insert
  // NOTE TO SELF: Display name is stored seperately due to the size concern 
  // being less than the performance concern when searching at scale.
  const passhash = await bcrypt.hash(password, 12);
  const user_id = await users.insertOne({
    display_name: username,
    username: username.toLowerCase(),
    primary_email: email.toLowerCase(),
    hashcode: passhash,
    created_date: c_date,
    level: "user"
  }).then( (res) => {
    return res.insertedId;
  })

  // Success Payload
  return {
    success: true,
    data: user_id,
  }
  
}

/** check_level
 * @param {string} user_id
 * @return {Promise<Object>}
 */
async function check_level(user_id) {
  // Init
  const db = await mdb_connect();
  const users = db.collection("users");
  const ob_id = ObjectId.createFromHexString(user_id);
  const level = await users.findOne({user_id: ob_id}).then(res => {
    if(res){
      return res.level;
    } 
    else {
      return res
    }
  })

  if(level) {
    return {
      success: true,
      data: level,
    }
  }
  return {
    success: false,
    error_message: "User Not Found"
  }

}

/** get_user
 * Gets basic user information (administrative)
 * @param {string} username //Username or Email
 * @return {Promise<Object>}
 */
async function get_user(username) {
  // Init
  const isEmail = username.indexOf("@") > 0; // Check if email
  const db = await mdb_connect(); // DB Con
  const users = db.collection("users"); // User table
  const proj = { hashcode: 0, } // Projection to exclude pass-hashes
  let user = null; // User object, not directly returned so that we have the success state

  // Find the User
  if(isEmail) {
    user = await users.findOne({primary_email: username.toLowerCase()}, {projection: proj})
  }
  else {
    user = await users.findOne({username: username.toLowerCase()}, {projection: proj})
  }

  // Return Payload
  if(user) {
    return {
      success: true,
      data: user,
    }
  }
  else {
    return {
      success: false,
      error_message: "User Not Found"
    }
  }
}

/** get_users
 * Gets basic user information (administrative)
 * @return {Promise<Object>}
 */
async function get_users() {
  // Init
  const db = await mdb_connect(); // DB Con
  const users = db.collection("users"); // User table
  const proj = { hashcode: 0, } // Projection to exclude pass-hashes

  // Fetch users
  const user_col = await users.find({}, {projection: {hashcode:0}}).toArray();

  // Return Payload
  if(user_col) {
    return {
      success: true,
      data: user_col,
    }
  }
  else {
    return {
      success: false,
      error_message: "Unknown Error"
    }
  }
}

/** remove_user
 * Removes user from database and anonymizes connected data
 * @param {string} user_id
 * @return {Promise<Object>} 
 */
async function remove_user(user_id) {
  // Init
  const db = await mdb_connect();
  const users = db.collection("users");
  let obj_id;

  // Catch invalid user_id supplied errors
  try {
    obj_id = ObjectId.createFromHexString(user_id);
  }
  catch (err) {
    return {
      success: false,
      error_message: "User Id must be supplied"
    }
  }
  
  // TODO Anonymize data once other endpoints are created

  // Removal from database
  const result = await users.deleteOne({_id:obj_id});

  if(result.acknowledged) {
    if(result.deletedCount) {
      return {
        success: true,
      }
    }
    else {
      return {
        success: false,
        error_message: "No matching users",
      }
    }
  }
  else { // Mongo side issue
    return {
      success: false,
      error_message: "Server Error",
    }
  }

}

export { register_user, check_level, get_user, get_users, remove_user, }