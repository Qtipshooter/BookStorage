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
  if (await users.findOne({username: username})) { err_msg = "Username in use"; invalid_registration = true;}
  if (await users.findOne({primary_email: email})) { err_msg = "Email in use"; invalid_registration = true;}

  // Response is illegal, Return
  if (invalid_registration) {
    return {
      success: false,
      error_message: err_msg,
    }
  }

  // Checks complete, insert
  const passhash = await bcrypt.hash(password, 12);
  const user_id = await users.insertOne({
    username: username,
    primary_email: email,
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
    user = await users.findOne({primary_email: username}, {projection: proj})
  }
  else {
    user = await users.findOne({username: username}, {projection: proj})
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

// ------ TEST FUNCTIONS ------ //

function util_test_result_code(result) {
  if(result == "pass") {
    return "[\x1b[32mPass\x1b[0m]"
  }
  if(result == "fail") {
    return "[\x1b[31mFail\x1b[0m]"
  }
  return "";
}

async function test_register_user() {
  /**Cases to write
   * successful normal user, duplicate of first user (1 for username, 1 for email),
   * invalid username (short, long, character, numbers,), invalid email (characters, missing @, additional @,)
   */

  let passing = true;

  // Function for reading test output regardless of outcome
  function check_test_register_user (response, pass_cond, test_num){
    if (response.success == pass_cond){
      if(response.success) {
        console.log("#" + test_num + " " + util_test_result_code("pass") + " Registered UserID: " + response.data.user_id);
      }
      else {
        console.log("#" + test_num + " " + util_test_result_code("pass") + " Failed to enter user, message: " + response.error_message);
      }
    }
    else {
      passing = false;
      if(response.success) {
        console.log("#" + test_num + " " + util_test_result_code("fail") + " Registered invalid user: " + response.data.user_id);
      }
      else {
        console.log("#" + test_num + " " + util_test_result_code("fail") + " Failed to enter user, message: " + response.error_message);
      }
    }
  }

  // Tests Array
  const tests = [
    {
      user: "JohnDoe1",
      email: "john.doe@gmail.com",
      pass: "Password123",
      cond: true
    },
    {
      user: "JaneDoe1",
      email: "jane.doe@gmail.com",
      pass: "asdfghjkl;'1234567890",
      cond: true
    },
    {
      user: "JohnDoe",
      email: "johnathan.doe@geeeze.com",
      pass: "!@#$%^&*()_+~{}|:\"<>,./;']\\\"aB1", // Inputed Password: !@#$%^&*()_+~{}|:"<>,./;']\"aB1
      cond: true
    },
    {
      user: "Bobby@Tables",
      email: "drop+table_child.wah@delete.ahh",
      pass: "Delete It All!",
      cond: false
    },
    {
      user: "Sky",
      email: "so.ar@gmail.com",
      pass: "more than 1 star in the sky",
      cond: true
    },
  ];

  // Running Tests
  console.log("-- Testing register_user --");
  for (let i = 0; i < tests.length; i++) {
    await register_user(tests[i].user, tests[i].email, tests[i].pass).then((res) => {check_test_register_user(res, tests[i].cond, i)});
  }
  console.log("-- Test register_user complete --");
  return passing;
}

async function test_check_level() {
  
}

async function test_get_user() {
  let passing = true;

  function check_test_get_user(response, pass_cond, test_num) {
    if(response.success == pass_cond) {
      if(response.success) {
        console.log("#" + test_num + " " + util_test_result_code("pass") + " User Obtained: " + response.data.username);
      }
      else {
        console.log("#" + test_num + " " + util_test_result_code("pass") + " User not found");
      }
    }
    else {
      passing = false;
      if(response.succes) {
        console.log("#" + test_num + " " + util_test_result_code("fail") + " User Obtained: " + response.data.username);
      }
      else {
        console.log("#" + test_num + " " + util_test_result_code("fail") + " User not found");
      }
    }
  }

  // Tests Array
  const tests = [
    {
      username: "JohnDoe1",
      cond: true,
    },
    {
      username: "Giberish",
      cond: false,
    },
    {
      username: "john.doe@gmail.com",
      cond: true,
    },
    {
      username: "@JohnDoe1",
      cond: false,
    },
  ];

  // Running Tests
  for (let i = 0; i < tests.length; i++) {
    await get_user(tests[i].username).then((res) => {check_test_get_user(res, tests[i].cond, i)});
  }

}


// ------ Run Tests ------ //
await test_register_user();
await test_get_user();
// await test_check_level();
process.exit()