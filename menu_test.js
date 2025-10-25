import { test_all } from './backend/tests/test_all.js';
import { mdb_connect } from './backend/util/db_connection.js';
import { util_seed_test_database, ask } from './backend/tests/util_test.js';


let selection = "reset";
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
      console.log("Work in Progress. . .");
      break;
    
    case "book":
    case "books":
      console.log("Work in Progress. . .");
      break;
    
    case "lib":
    case "library":
    case "libraries":
      console.log("Work in Progress. . .");
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
  console.log(
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