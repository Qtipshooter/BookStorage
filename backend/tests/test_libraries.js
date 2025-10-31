import { get_library, search_library, add_to_library, remove_from_library, delete_user_library, admin_remove_from_library, admin_remove_from_all_libraries, admin_get_library, } from "../api/libraries.js";
import { ask } from "./util_test.js";


async function test_get_library() {
  let passing = true;
  // Testing To Be Implemented
  return passing;
}

async function test_search_library() {
  let passing = true;
  // Testing To Be Implemented
  return passing;
}

async function test_add_to_library() {
  let passing = true;
  // Testing To Be Implemented
  return passing;
}

async function test_remove_from_library() {
  let passing = true;
  // Testing To Be Implemented
  return passing;
}

async function test_delete_user_library() {
  let passing = true;
  // Testing To Be Implemented
  return passing;
}

async function test_admin_remove_from_library() {
  let passing = true;
  // Testing To Be Implemented
  return passing;
}

async function test_admin_remove_from_all_libraries() {
  let passing = true;
  // Testing To Be Implemented
  return passing;
}

async function test_admin_get_library() {
  let passing = true;
  // Testing To Be Implemented
  return passing;
}

export async function menu_test_library(session) {
  let response;
  let selection = "reset";

  do {
    switch (selection.toLowerCase()) {
      case "get":
        // Verification and Data Gathering
        if (!(session && session._id)) { console.log("Not signed in!"); break; }
        response = await get_library(session._id).then((res) => {
          if (res.success) { return res.data; }
          else { console.log(res.error_message); return null; }
        });
        if (!response) { break; }

        // Function Output
        while (await response.cursor.hasNext()) {
          console.log(await response.cursor.next());
        }
        break;

      case "add":
        // Add Menu Function  

        break;

      case "remove":
        // Remove Menu Function  

        break;

      case "search":
        // Search Menu Function  

        break;

      case "delete":
        // Delete Menu Function  

        break;

      case "a_get":
        // A_Get Menu Function  

        break;

      case "a_delete":
        // A_Delete Menu Function  

        break;

      case "a_remove":
        // A_Remove Menu Function  

        break;

      case "exit":
        // Exit Menu Function  

        break;

      case "reset":
        break;

      default:
        console.log("Invalid Selection")
        break;
    }

    console.log();

    // Menu and fetch next menu option
    console.log("\n-- Signed In Functions --\n" +
      `Get:        Get all the books in your library` + "\n" +
      `Add:        Adds an existing book to your library` + "\n" +
      `Remove:     Removes a book from your library` + "\n" +
      `Search:     Searches library for a specific book` + "\n" +
      `Delete:     Deletes all books in library` + "\n" +
      `-- Admin Functions --` + "\n" +
      `A_Get:      Gets a user library` + "\n" +
      `A_Delete:   Deletes a book from all libraries` + "\n" +
      `A_Remove:   Deletes a book from a specific user library` + "\n" +
      `Exit:       Returns to main menu`);
    selection = await ask("Option Selection > ");
    console.log();
  } while (selection.toLowerCase() != "exit");

  return session;
}

export async function test_library() {
  let passing = true;
  if (!await test_get_library()) { passing = false; }
  if (!await test_search_library()) { passing = false; }
  if (!await test_add_to_library()) { passing = false; }
  if (!await test_remove_from_library()) { passing = false; }
  if (!await test_delete_user_library()) { passing = false; }
  if (!await test_admin_remove_from_library()) { passing = false; }
  if (!await test_admin_remove_from_all_libraries()) { passing = false; }
  if (!await test_admin_get_library()) { passing = false; }
  return passing;
}