import { util_test_result_code } from "./util_test.js";
import {register_user, check_level, get_user, get_users, remove_user,} from "../api/users.js"
import { ObjectId } from "bson";

// ------ TEST FUNCTIONS ------ //

async function test_register_user() {
  
  let passing = true;

  // Function for reading test output regardless of outcome
  function check_test_register_user (response, pass_cond, test_num){
    if (response.success == pass_cond){
      if(response.success) {
        console.log("#" + test_num + " " + util_test_result_code("pass") + " Registered UserID: " + response.data);
      }
      else {
        console.log("#" + test_num + " " + util_test_result_code("pass") + " Failed to enter user, message: " + response.error_message);
      }
    }
    else {
      passing = false;
      if(response.success) {
        console.log("#" + test_num + " " + util_test_result_code("fail") + " Registered invalid user: " + response.data);
      }
      else {
        console.log("#" + test_num + " " + util_test_result_code("fail") + " Failed to enter user, message: " + response.error_message);
      }
    }
  }

  // Tests Array
  const tests = [
    {
      user: "12345",
      email: "12345@email.com",
      pass: "Password1",
      cond: true,
    },
    {
      user: "AverageUser",
      email: "average.user@email.com",
      pass: "Sem1$ecure",
      cond: true,
    },
    {
      user: "Sagar",
      email: "savy.user@email.com",
      pass: "Pass 2 spaces!",
      cond: true,
    },
    {
      user: "Barbie",
      email: "foriegn.user@email.co.uk",
      pass: "Crikey2.0",
      cond: true,
    },
    {
      user: "NOCAPCAPS",
      email: "LARGELETTERSARECOOL@EMAIL.COM",
      pass: "Except for this 1 password",
      cond: true,
    },
    {
      user: "AverageUser",
      email: "placeholder@email.com",
      pass: "Password1",
      cond: false,
    },
    {
      user: "Placeholder",
      email: "average.user@email.com",
      pass: "Password1",
      cond: false,
    },
    {
      user: "A",
      email: "a@a.a",
      pass: "Password1",
      cond: false,
    },
    {
      user: "Norman",
      email: "norm@email.com",
      pass: "password",
      cond: false,
    },
    {
      user: "Norman2",
      email: "norm2@email.com",
      pass: "Password",
      cond: false,
    },
    {
      user: "Norman3",
      email: "norm3@email.com",
      pass: "12345678",
      cond: false,
    },
    {
      user: "Norman4",
      email: "norm4@email.com",
      pass: "Pass2",
      cond: false,
    },
  ];

  // Running Tests
  console.log("-- Testing register_user --");
  for (let i = 0; i < tests.length; i++) {
    await register_user(tests[i].user, tests[i].email, tests[i].pass).then((res) => {check_test_register_user(res, tests[i].cond, i+1)});
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
        console.log("#" + test_num + " " + util_test_result_code("pass") + " User Obtained: " + response.data.display_name);
      }
      else {
        console.log("#" + test_num + " " + util_test_result_code("pass") + " User not found");
      }
    }
    else {
      passing = false;
      if(response.success) {
        console.log("#" + test_num + " " + util_test_result_code("fail") + " User Obtained: " + response.data.display_name);
      }
      else {
        console.log("#" + test_num + " " + util_test_result_code("fail") + " User not found");
      }
    }
  }

  // Tests Array
  const tests = [
    {
      username: "admin",
      cond: true,
    },
    {
      username: "JohnDoe1",
      cond: true,
    },
    {
      username: "john.doe@email.com",
      cond: true,
    },
    {
      username: "fancy+email@email.co.uk",
      cond: true,
    },
    {
      username: "FANCY+EMAIL@EMAIL.CO.UK",
      cond: true,
    },
    {
      username: "nocapcaps",
      cond: true,
    },
    {
      username: "12345",
      cond: true,
    },
    {
      username: "drips@peters.gov",
      cond: true,
    },
    {
      username: "Peter",
      cond: true,
    },
    {
      username: "Gibberish",
      cond: false,
    },
    {
      username: "@AverageUser",
      cond: false,
    },
    {
      username: "Average",
      cond: false,
    },
    {
      username: "George ",
      cond: false,
    },
    {
      username: "B@Barbie",
      cond: false,
    },
  ];

  // Running Tests
  console.log("-- Testing get_user --");
  for (let i = 0; i < tests.length; i++) {
    await get_user(tests[i].username).then((res) => {check_test_get_user(res, tests[i].cond, i+1)});
  }
  console.log("-- Test get_user complete --");

  return passing;
}

async function test_get_users() { 
  let passing = true;
  
  function check_test_get_users(response) {
    if(response.success) {
      console.log(util_test_result_code("pass") + " Users Found:")
      response.data.forEach(user => {
        console.log(JSON.stringify(user));
      });
    }
    else {
      passing = false;
      console.log(util_test_result_code("fail") + " Users not Fetched")
    }
  }
  console.log("-- Testing get_users --");
  await get_users().then((res) => {check_test_get_users(res)});
  console.log("-- Test get_users complete --");
  return passing;
}

async function test_remove_user() {
  const user_id = await get_user("JohnDoe1").then((res) => {
    if(res.success) {
      return res.data._id;
    }
    else {
      return null;
    }
  })

  const result = await remove_user(user_id.toString()).then((res) => {
    if (res.success) {
      console.log(util_test_result_code("pass") + " User Removed");
      return true;
    } else {
      console.log(util_test_result_code("fail") + " Error: " + res.error_message);
      return false;
    }
  })

  return result;
}

//tests 
export async function test_users() {
  await test_register_user();
  await test_get_user();
  //await test_get_users();
  //await test_remove_user();
}
