import { createInterface } from 'node:readline';
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import { MongoClient } from "mongodb";
import { get_ObjectID } from "../util.js";
import { test_init_books, test_init_users, test_init_libraries } from './test_data.js';
dotenv.config({ path: ".env.test" });

/** util_test_result_code
 * Colors and formats the result code identifier
 * @param {string} result pass | fail | info
 * @returns {string}
 */
function util_test_result_code(result) {
  if (result == "pass") {
    return "[\x1b[32mPass\x1b[0m]"
  }
  if (result == "fail") {
    return "[\x1b[31mFail\x1b[0m]"
  }
  if (result == "info") {
    return "[\x1b[33mInfo\x1b[0m]"
  }
  return "";
}

/** util_seed_test_database
 * Drops current test database and seeds the test database
 */
async function util_seed_test_database() {
  // Init
  const connection_string = process.env.CONNECTION_STRING + process.env.DATABASE_NAME;
  const client = new MongoClient(connection_string);
  await client.connect();
  const db = client.db();
  const users_col = db.collection("users");
  const books_col = db.collection("books");
  const libraries_col = db.collection("libraries");

  // Drop Databases
  console.log(util_test_result_code("info") + " Dropping previous test Database . . .");
  try {
    const result = await db.dropDatabase();
    console.log(util_test_result_code("info") + " Database Dropped")
  }
  catch (err) {
    console.log("Error Dropping DB: " + err);
    return {
      success: false,
      error_message: "Error Dropping DB: " + err,
    }
  }

  // Add Default User Table
  console.log(util_test_result_code("info") + " Adding Preset Users . . .")
  await users_col.insertMany(test_init_users)
  console.log(util_test_result_code("info") + " Users Added")

  // Add Default Book Table
  console.log(util_test_result_code("info") + " Adding Preset Books . . .")
  await books_col.insertMany(test_init_books);
  console.log(util_test_result_code("info") + " Books Added")

  // Add Default Book Table
  console.log(util_test_result_code("info") + " Adding Preset Libraries . . .")
  await libraries_col.insertMany(test_init_libraries);
  console.log(util_test_result_code("info") + " Libraries Added")
}

/** util_check_test
 * Checks the result of a test
 * @param {Object} response
 * @param {boolean} pass_cond
 * @param {number} test_num
 * @return {boolean} (Passing or not)
 */
function util_check_test(response, pass_cond, test_num) {
  // Init
  let passing = true;
  let output = "";

  if (typeof test_num === "number") {
    output = "#" + test_num + " ";
  }

  try {
    if (response.success == pass_cond) {
      output = output + util_test_result_code("pass") + " ";
    }
    else {
      passing = false;
      output = output + util_test_result_code("fail") + " ";
    }

    if (response.success) {
      output = output + "Data: " + JSON.stringify(response.data);
    }
    else {
      output = output + "Error " + response.error_code + ": " + response.error_message;
    }

    if (!passing) {
      output = output + "\n\tData: " + JSON.stringify(response);
    }
  }
  catch (err) {
    if (!err.name === "TypeError") {
      console.log("Error: " + err);
    }
  }

  console.log(output);
  return passing;
}

/** ask
 * Gets user input while giving question as prompt
 * @param {string} question 
 * @returns {Promise<string>} user input
 */
async function ask(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

export {
  util_test_result_code,
  util_seed_test_database,
  util_check_test,
  ask,
}