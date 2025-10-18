import bcrypt from "bcrypt";
import dotenv from "dotenv"
import { MongoClient } from "mongodb";
dotenv.config({path: ".env.test"});

/** util_test_result_code
 * Colors and formats the result code identifier
 * @param {string} result pass | fail | info
 * @returns {string}
 */
function util_test_result_code(result) {
  if(result == "pass") {
    return "[\x1b[32mPass\x1b[0m]"
  }
  if(result == "fail") {
    return "[\x1b[31mFail\x1b[0m]"
  }
  if(result == "info") {
    return "[\x1b[33mInfo\x1b[0m]"
  }
  return "";
}

/** util_seed_test_database
 * Drops current test database and seeds the test database
 */
async function util_seed_test_database() {
  // Drop Databases
  const connection_string = process.env.CONNECTION_STRING + process.env.DATABASE_NAME;
  const passes = Number(process.env.HASH_PASSES);
  console.log(typeof passes)
  const client = new MongoClient(connection_string);
  await client.connect();
  console.log(util_test_result_code("info") + " Dropping previous test Database . . .");
  const db = client.db();
  try{
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
  const users_col = db.collection("users");
  const create_date = new Date();
  const users = [
    {
      display_name: "admin",
      username: "admin",
      primary_email: "admin@admin.com",
      hashcode: await bcrypt.hash("P@55C0d3s", passes),
      created_date: create_date,
      level: "admin"
    },
    {
      display_name: "dev",
      username: "dev",
      primary_email: "dev@admin.com",
      hashcode: await bcrypt.hash("2 Correct Horse Battery Staples", passes),
      created_date: create_date,
      level: "admin"
    },
    {
      display_name: "JohnDoe1",
      username: "johndoe1",
      primary_email: "john.doe@email.com",
      hashcode: await bcrypt.hash("Password1", passes),
      created_date: create_date,
      level: "user"
    },
    {
      display_name: "Jane_Doe",
      username: "jane_doe",
      primary_email: "jane.doe@email.com",
      hashcode: await bcrypt.hash("H4rd3rP@55word", passes),
      created_date: create_date,
      level: "user"
    },
    {
      display_name: "Sara_Codes",
      username: "sara_codes",
      primary_email: "fancy+email@email.co.uk",
      hashcode: await bcrypt.hash("Password with 3 spaces.", passes),
      created_date: create_date,
      level: "user"
    },
    {
      display_name: "Sagar0cean",
      username: "sagar0cean",
      primary_email: "0cean@email.com",
      hashcode: await bcrypt.hash("!?or?!Shebang2", passes),
      created_date: create_date,
      level: "user"
    },
    {
      display_name: "PETER",
      username: "peter",
      primary_email: "drips@peters.gov",
      hashcode: await bcrypt.hash("Actually 2 tiny Pass", passes),
      created_date: create_date,
      level: "user"
    },
    {
      display_name: "George",
      username: "george",
      primary_email: "yellowhat@man.com",
      hashcode: await bcrypt.hash("2Curious4you", passes),
      created_date: create_date,
      level: "user"
    },
  ]
  await users_col.insertMany(users)
  console.log(util_test_result_code("info") + " Users Added")
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
  
  if(typeof test_num === "number") {
    output = "#" + test_num + " ";
  }

  try{
    if(response.success == pass_cond) {
      output = output + util_test_result_code("pass") + " ";
    }
    else {
      passing = false;
      output = output + util_test_result_code("fail") + " ";
    }

    if(response.success) {
      output = output + "Data: " + JSON.stringify(response.data);
    }
    else {
      output = output + "Error: " + response.error_message;
    }

    if(!passing) {
      output = output + "\n\tData: " + JSON.stringify(response);
    }
  }
  catch (err) {
    console.log("Error: " + err)
  }

  console.log(output);
  return passing;
}

export {
  util_test_result_code,
  util_seed_test_database,
  util_check_test,
}