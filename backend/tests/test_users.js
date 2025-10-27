import { util_check_test, ask } from "./util_test.js";
import { register_user, get_level, get_user, get_users, remove_user, authorize_user, get_user_by_id } from "../api/users.js"

// ------ TEST FUNCTIONS ------ //

async function test_register_user() {

  let passing = true;

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
    await register_user(tests[i].user, tests[i].email, tests[i].pass).then((res) => { util_check_test(res, tests[i].cond, i + 1) });
  }
  console.log("-- Test register_user complete --");
  return passing;
}

async function test_authorize_user() {
  // Init
  let passing = true;

  const test_cases = [
    {
      user: "JohnDoe1",
      pass: "Password1",
      cond: true,
    },
    {
      user: "Jane_Doe",
      pass: "H4rd3rP@55word",
      cond: true,
    },
    {
      user: "Sara_Codes",
      pass: "Password with 3 spaces.",
      cond: true,
    },
    {
      user: "0cean@email.com",
      pass: "!?or?!Shebang2",
      cond: true,
    },
    {
      user: "savy.user@email.com",
      pass: "Pass 2 spaces!",
      cond: true,
    },
    {
      user: "JohnDoe1",
      pass: " Password1",
      cond: false,
    },
    {
      user: "NonExistantUser",
      pass: "AnyPassword2",
      cond: false,
    },
    {
      user: "nonexistant@email.com",
      pass: "AnyPassword3",
      cond: false,
    },
    {
      user: "admin",
      pass: "{$ne:1}",
      cond: false,
    },
    {
      user: "admin",
      pass: "$ne:1",
      cond: false,
    },
    {
      user: "$ne:1",
      pass: "$ne:1",
      cond: false,
    },
    {
      user: "{$ne:1}",
      pass: "{$ne:1}",
      cond: false,
    },
    {
      user: "\$ne:1",
      pass: "\$ne:1",
      cond: false,
    },
    {
      user: "\{\$ne:1\}",
      pass: "\{\$ne:1\}",
      cond: false,
    },
  ]

  console.log("-- Testing authorize_user --");
  for (let i = 0; i < test_cases.length; i++) {
    await authorize_user(test_cases[i].user, test_cases[i].pass).then((res) => { util_check_test(res, test_cases[i].cond, i + 1) });
  }
  console.log("-- Test authorize_user complete --");
}

async function test_get_level() {

  // Init
  let passing = true;
  let test_cases = [];

  // Usernames to find IDs of valid users
  const usernames = [
    "admin", "dev", "Jane_Doe", "fancy+email@email.co.uk"
  ]
  // Usernames/IDs for invalid testing
  const invalids = [
    "administrator", "johndoe1", "@@@@@\@@", "68e97b013b88d8b26278d3e7",
  ]

  // Get user_ids for valid users
  for (let i = 0; i < usernames.length; i++) {
    let user = await get_user(usernames[i]);
    if (user.success) {
      test_cases.push({ user_id: user.data._id.toString(), cond: true });
    }
  }

  // Insert invalid tests
  for (let i = 0; i < invalids.length; i++) {
    test_cases.push({ user_id: invalids[i], cond: false });
  }

  console.log("-- Testing get_level --");
  for (let i = 0; i < test_cases.length; i++) {
    await get_level(test_cases[i].user_id).then((res) => { util_check_test(res, test_cases[i].cond, i + 1) });
  }
  console.log("-- Test get_level complete --");
}

async function test_get_user() {
  let passing = true;

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
    await get_user(tests[i].username).then((res) => { util_check_test(res, tests[i].cond, i + 1) });
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

  // Init
  let passing = true;
  let test_cases = [];

  // Usernames to find IDs of valid users
  const usernames = [
    "dev", "Jane_Doe", "fancy+email@email.co.uk", "12345", "averageuser", "NOCAPCAPS",
  ]
  // Usernames/IDs for invalid testing
  const invalids = [
    "administrator", "johndoe1", "@@@@@\@@", "68e97b013b88d8b26278d3e7",
  ]

  // Get user_ids for valid users, then send to deletion
  for (let i = 0; i < usernames.length; i++) {
    let user = await get_user(usernames[i]);
    if (user.success) {
      test_cases.push({ user_id: user.data._id.toString(), cond: true });
    }
  }

  // Insert invalid tests
  for (let i = 0; i < invalids.length; i++) {
    test_cases.push({ user_id: invalids[i], cond: false });
  }

  // Running Tests
  console.log("-- Testing remove_user --");
  for (let i = 0; i < test_cases.length; i++) {
    await remove_user(test_cases[i].user_id).then((res) => { util_check_test(res, test_cases[i].cond, i + 1) });
  }
  console.log("-- Test remove_user complete --");

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
            session.email = data.primary_email;
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
  await test_register_user();
  await test_get_user();
  await test_get_users();
  await test_authorize_user();
  await test_get_level();
  await test_remove_user();
}

