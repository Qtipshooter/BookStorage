import { util_check_test, ask, util_test_result_code } from "./util_test.js";
import { register_user, get_level, get_user, get_users, remove_user, authorize_user, get_user_by_id } from "../api/users.js";
import { test_cases_register_user, test_cases_get_level, test_cases_get_user, test_cases_remove_user, test_cases_authorize_user, test_cases_get_user_by_id } from "./test_data.js";

// ------ TEST FUNCTIONS ------ //

async function test_register_user() {
  let passing = true;

  // Running Tests
  console.log("-- Testing register_user --");
  for (let i = 0; i < test_cases_register_user.length; i++) {
    await register_user(test_cases_register_user[i].user, test_cases_register_user[i].email, test_cases_register_user[i].pass).then((res) => {
      if (!util_check_test(res, test_cases_register_user[i].cond, i + 1)) { passing = false; }
    });
  }
  console.log("-- Test register_user complete --");
  return passing;
}

async function test_get_level() {
  let passing = true;

  console.log("-- Testing get_level --");
  for (let i = 0; i < test_cases_get_level.length; i++) {
    await get_level(test_cases_get_level[i].user_id).then((res) => {
      if (!util_check_test(res, test_cases_get_level[i].cond, i + 1)) { passing = false; }
    });
  }
  console.log("-- Test get_level complete --");
  return passing;
}

async function test_get_user() {
  let passing = true;

  // Running Tests
  console.log("-- Testing get_user --");
  for (let i = 0; i < test_cases_get_user.length; i++) {
    await get_user(test_cases_get_user[i].username).then((res) => {
      if (!util_check_test(res, test_cases_get_user[i].cond, i + 1)) { passing = false; }
    });
  }
  console.log("-- Test get_user complete --");
  return passing;
}

async function test_get_users() {
  let passing = true;

  console.log("-- Testing get_users --");
  passing = await get_users().then((res) => { return util_check_test(res, true) });
  console.log("-- Test get_users complete --");
  return passing;
}

async function test_remove_user() {
  let passing = true;

  // Running Tests
  console.log("-- Testing remove_user --");
  for (let i = 0; i < test_cases_remove_user.length; i++) {
    await remove_user(test_cases_remove_user[i].user_id).then((res) => {
      if (!util_check_test(res, test_cases_remove_user[i].cond, i + 1)) { passing = false; }
    });
  }
  console.log("-- Test remove_user complete --");

  return passing;
}

async function test_authorize_user() {
  // Init
  let passing = true;

  console.log("-- Testing authorize_user --");
  for (let i = 0; i < test_cases_authorize_user.length; i++) {
    await authorize_user(test_cases_authorize_user[i].username, test_cases_authorize_user[i].password).then((res) => {
      if (!util_check_test(res, test_cases_authorize_user[i].cond, i + 1)) { passing = false; }
    });
  }
  console.log("-- Test authorize_user complete --");
  return passing;
}

async function test_get_user_by_id() {
  let passing = true;

  console.log("-- Testing get_user_by_id --");
  for (let i = 0; i < test_cases_get_user_by_id.length; i++) {
    await get_user_by_id(test_cases_get_user_by_id[i].user_id).then((res) => {
      if (!util_check_test(res, test_cases_get_user_by_id[i].cond, i)) { passing = false; }
    });
  }
  console.log("-- Test get_user_by_id complete --");
  return passing;
}

export async function menu_test_users(session) {
  // Init
  let selection = "reset";
  let data;
  let user;
  let pass;
  let email;

  // Menu Loop
  do {
    switch (selection.toLowerCase()) {
      case "all":
        data = await get_users();
        if (data.success) {
          data = data.data;
          console.log("Fetched users\n");
          console.log(data);
        }
        else {
          console.log(data.error_message);
        }
        break;

      case "get":
        subinput = await ask("User to search for > ");
        data = await get_user(subinput);
        if (data.success) {
          data = data.data;
          console.log(data);
        }
        else {
          console.log(data.error_message);
        }
        break;

      case "add":
        user = await ask("Username > ");
        email = await ask("Email    > ");
        pass = await ask("Password > ");
        data = await register_user(user, email, pass);
        if (data.success) {
          data = data.data;
          console.log("Successfully registered user " + user + " with id: " + data);
        }
        else {
          console.log(data.error_message);
        }
        break;

      case "remove":
        subinput = await ask("User to remove > ");
        data = await get_user(subinput);
        if (data.success) {
          data = await remove_user(data);
        }
        else {
          console.log(data.error_message);
          break;
        }

        if (data.success) {
          data = data.data;
        }
        else {
          console.log(data.error_message);
        }
        break;

      case "signin":
        user = await ask("Username/Email > ");
        pass = await ask("Password > ")
        data = await authorize_user(user, pass);

        if (data.success) {
          data = data.data;
          console.log("User Authorized!");
          session._id = data;
          console.log("User ID:    " + session._id);
          data = await get_user_by_id(session._id);
          if (data.success) {
            data = data.data;
            session.username = data.display_name;
            session.email = data.email;
            session.level = data.level;
            console.log("Username:   " + session.username);
            console.log("Email:      " + session.email);
            console.log("Perm Level: " + session.level);
          }
          else {
            console.log("Unable to fetch other data" + data.error_message);
          }
        }
        else {
          console.log(data.error_message);
        }
        break;

      case "signout":
        session = {};
        console.log("Session Deleted!");
        break;

      case "session":
        console.log("Current Session: ");
        console.log(session);
        break;

      case "level":
        if (session._id && session.level) {
          console.log("Current user level: " + session.level);
          break;
        }
        if (session._id) {
          data = await get_level(session._id);
          if (data.success) {
            session.level = data.data;
            console.log("Current user level: " + session.level);
          }
          else {
            console.log("Unable to get user level: " + data.error_message);
          }
        }
        break;

      case "reset":
        break;

      default:
        console.log("Invalid Selection")
        break;
    }

    console.log();

    // Menu and fetch next menu option
    console.log("\n" +
      `All:         Show all users in the database` + "\n" +
      `Get:         Find a user by username/email` + "\n" +
      `Add:         Add a new user` + "\n" +
      `Remove:      Remove a user` + "\n" +
      `Signin/in:   Login to a user account` + "\n" +
      `Signout/out: Logout of user account` + "\n" +
      `Session:     Shows current session details` + "\n" +
      `Level:       Shows permission level of signed in user` + "\n" +
      `Exit:        Exit the menu`)
    selection = await ask("Option Selection > ")
    console.log();
  } while (selection.toLowerCase() != "exit");

  return session;
}

//tests 
export async function test_users() {
  let passing = true;
  if (!await test_register_user()) { passing = false; }
  if (!await test_get_level()) { passing = false; }
  if (!await test_get_user()) { passing = false; }
  if (!await test_get_users()) { passing = false; }
  if (!await test_remove_user()) { passing = false; }
  if (!await test_authorize_user()) { passing = false; }
  if (!await test_get_user_by_id()) { passing = false; }
  console.log("\n" + util_test_result_code(passing ? "pass" : "fail") + " User Tests Complete\n");
  return passing;
}

