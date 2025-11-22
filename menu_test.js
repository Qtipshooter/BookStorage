import { test_all } from './src/backend/tests/test_all.js';
import { mdb_connect } from './src/backend/util.js';
import { util_seed_test_database, ask } from './src/backend/tests/util_test.js';
import { menu_test_books } from './src/backend/tests/test_books.js';
import { menu_test_users } from './src/backend/tests/test_users.js';
import { menu_test_library } from './src/backend/tests/test_libraries.js';


// Init
let selection = "reset";
let session = {};
const menu_db = await mdb_connect();

// Main Menu
do {
  switch (selection.toLowerCase()) {
    case "init":
    case "initialize":
      await util_seed_test_database();
      break;
    
    case "all":
      await test_all();
      break;
    
    case "user":
    case "users":
      console.log("Entering User Menu . . .");
      session = await menu_test_users(session);
      console.log("Returned to main menu!");
      break;
    
    case "book":
    case "books":
      console.log("Entering Book Menu . . .");
      session = await menu_test_books(session);
      console.log("Returned to main menu!");
      break;
    
    case "lib":
    case "library":
    case "libraries":
      console.log("Entering Library Menu . . .");
      session = await menu_test_library(session);
      console.log("Returned to main menu!");
      break;
    
    case "clear":
      menu_db.dropDatabase();
      console.log("Database dropped");
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
    `Initialize:  Set Database to initial state` + "\n" +
    `All:         Run all tests (some may fail if you have modified initial DB)` + "\n" +
    `Users:       Open User DB submenu` + "\n" +
    `Books:       Open Book DB submenu` + "\n" +
    `Libraries:   Open Library DB submenu` + "\n" +
    `Clear:       Empties out the database` + "\n" +
    `Exit:        Exit the menu`)
  selection = await ask("Option Selection > ")
  console.log();
} while (selection.toLowerCase() != "exit");

process.exit();