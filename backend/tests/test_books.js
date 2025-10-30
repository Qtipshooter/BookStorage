// test_books.js
// Quinton Graham
// Tests the books.js functions

import { add_book, update_book, update_book_owner, delete_book, get_book, get_books, search_books } from "../api/books.js";
import { get_user } from "../api/users.js";
import { get_ObjectID } from "../api/util.js";
import { util_check_test, ask, util_test_result_code } from "./util_test.js";
import { test_cases_add_book, test_cases_update_book, test_cases_update_book_owner, test_cases_delete_book, test_cases_get_book, test_cases_get_books, test_cases_search_books, } from "./test_data.js";


async function test_add_book() {
  // Init
  let passing = true;

  // Run Tests
  console.log("-- Testing add_book --");
  for (let i = 0; i < test_cases_add_book.length; i++) {
    await add_book(test_cases_add_book[i].user_id, test_cases_add_book[i].book).then((res) => {
      if (!util_check_test(res, test_cases_add_book[i].cond, i + 1)) { passing = false; }
    });
  }
  console.log("-- Test add_book complete --");
  // Return output
  return passing;
}

async function test_update_book() {
  let passing = false;

  // Run Tests
  console.log("-- Testing update_book --");
  for (let i = 0; i < test_cases_update_book.length; i++) {
    await update_book(test_cases_update_book[i].user_id, test_cases_update_book[i].book_id, test_cases_update_book[i].updates).then((res) => {
      if (!util_check_test(res, test_cases_update_book[i].cond, i)) { passing = false; }
    });
  }
  console.log("-- Test update_book complete --");
  return passing;
}

async function test_update_book_owner() {
  let passing = false;

  // Run Tests
  console.log("-- Testing update_book_owner --");
  for (let i = 0; i < test_cases_update_book_owner.length; i++) {
    await update_book_owner(test_cases_update_book_owner[i].book_id, test_cases_update_book_owner[i].authorizing_user_id, test_cases_update_book_owner[i].new_user_id).then((res) => {
      if (!util_check_test(res, test_cases_update_book_owner[i].cond, i)) { passing = false; }
    });
  }
  console.log("-- Test update_book_owner complete --");
  return passing;
}

async function test_delete_book() {
  let passing = false;

  // Run Tests
  console.log("-- Testing delete_book --");
  for (let i = 0; i < test_cases_delete_book.length; i++) {
    await delete_book(test_cases_delete_book[i].user_id, test_cases_delete_book[i].book_id).then((res) => {
      if (!util_check_test(res, test_cases_delete_book[i].cond, i)) { passing = false; }
    });
  }
  console.log("-- Test delete_book complete --");
  return passing;
}

async function test_get_book() {
  // Init
  let passing = true;

  // Run Tests
  console.log("-- Testing get_book --");
  for (let i = 0; i < test_cases_get_book.length; i++) {
    await get_book(test_cases_get_book[i].book_id).then((res) => {
      if (!util_check_test(res, test_cases_get_book[i].cond, i + 1)) { passing = false; }
    });
  }
  console.log("-- Test get_book complete --");

  // Return Output
  return passing;
}

async function test_get_books() {
  let passing = false;

  // Run Tests
  console.log("-- Testing get_books --");
  for (let i = 0; i < test_cases_get_books.length; i++) {
    await get_books().then((res) => {
      if (!util_check_test(res, test_cases_get_books[i].cond, i)) { passing = false; }
    });
  }
  console.log("-- Test get_books complete --");
  return passing;
}

async function test_search_books() {
  let passing = false;

  // Run Tests
  console.log("-- Testing search_books --");
  for (let i = 0; i < test_cases_search_books.length; i++) {
    await search_books(test_cases_search_books[i].search_term).then((res) => {
      if (!util_check_test(res, test_cases_search_books[i].cond, i)) { passing = false; }
    });
  }
  console.log("-- Test search_books complete --");
  return passing;
}

export async function test_books() {
  let passing = true;
  if (!await test_add_book()) { passing = false; }
  if (!await test_update_book()) { passing = false; }
  if (!await test_update_book_owner()) { passing = false; }
  if (!await test_delete_book()) { passing = false; }
  if (!await test_get_book()) { passing = false; }
  if (!await test_get_books()) { passing = false; }
  if (!await test_search_books()) { passing = false; }
  console.log("\n" + util_test_result_code(passing ? "pass" : "fail") + "Book Tests Complete\n");
  return passing;
}

export async function menu_test_books(session) {
  let selection = "reset";
  let data = null;
  let book_id;
  let book = {};
  let subinput = "";

  console.log("Entered book Menu!");

  // Book Menu
  do {
    switch (selection.toLowerCase()) {
      case "all":
        data = await get_books(["all"]);
        if (data.success) {
          data = data.data;
          while (await data.cursor.hasNext()) {
            console.log(await data.cursor.next());
          }
        }
        else {
          console.log(data.error_message);
        }
        break;

      case "search":
        subinput = await ask("Term to search books for > ");
        data = await search_books(subinput);
        if (data.success) {
          data = data.data;
          while (await data.cursor.hasNext()) {
            console.log(await data.cursor.next());
          }
        }
        else {
          console.log(data.error_message);
        }
        break;

      case "add":
        if (!session._id) {
          console.log("You must login to a user first (User Menu)");
          break;
        }

        console.log("Input book data (enter nothing to ommit):");
        book = {}
        while (!book.title) {
          book.title = await ask("Title > ");
          if (!(book.title)) {
            "Title must be supplied"
          }
        }

        console.log("Enter Author(s) one per line:");
        book.authors = [];
        while (!book.authors.length || subinput) {
          subinput = await ask("Author > ");
          if (subinput) {
            book.authors.push(subinput);
          }
          if (!book.authors.length) {
            console.log("At least one author must be supplied");
          }
        }

        console.log("Enter Genre(s) one per line:");
        book.genres = [];
        subinput = -1;
        while (subinput) {
          subinput = await ask("Genre > ");
          if (subinput) {
            book.genres.push(subinput);
          }
        }

        subinput = await ask("Description > ");
        if (subinput) { book.description = subinput; }
        subinput = await ask("ISBN-10 > ");
        if (subinput) { book.isbn_10 = subinput; }
        subinput = await ask("ISBN-13 > ");
        if (subinput) { book.isbn_13 = subinput; }

        data = await add_book(session._id, book);
        console.log();

        if (data.success) {
          console.log("Book successfully added!\nID: " + data.data);
        }
        else {
          console.log(data.error_message);
        }

        break;

      case "remove":
        if (!session._id) {
          console.log("Need to be logged in for this option");
          break;
        }
        subinput = await ask("Term to search books for > ");
        data = await search_books(subinput);
        if (data.success) {
          data = data.data.cursor.toArray();
          console.log("Please select an option from the following")
          for (let i = 0; i < data.length; i++) {
            console.log(i + "]  \"" + data[i].title + "\" by " + (data[i].authors.length > 1 ? (data[i].authors[0] + " et al.") : data[i].authors[0]));
          }
          do {
            subinput = Number(await ask("Selection > "));
            if (subinput === NaN) {
              subinput = null;
              console.log("Invalid Selection!");
            }
          } while (!subinput);

          console.log("Deleting " + data[subinput].title);
          data = await delete_book(session._id, data[subinput]._id);
          if (data.success) {
            console.log("Book deleted");
          }
          else {
            console.log("Error deleting book: " + data.error_message);
          }

        }
        else {
          console.log(data.error_message);
        }
        break;

      case "update":
        if (!session._id) {
          console.log("Need to be logged in for this option");
          break;
        }

        subinput = await ask("Term to search books for > ");
        data = await search_books(subinput);
        if (data.success) {
          data = await data.data.cursor.toArray();
          console.log("Please select an option from the following")
          for (let i = 0; i < data.length; i++) {
            console.log((i + 1) + "]  \"" + data[i].title + "\" by " + (data[i].authors.length > 1 ? (data[i].authors[0] + " et al.") : data[i].authors[0]));
          }
          do {
            subinput = Number(await ask("Selection > "));
            if (subinput === NaN || subinput < 1 || subinput > data.length) {
              subinput = null;
              console.log("Invalid Selection!");
            }
          } while (!subinput);
          subinput -= 1; // due to displaying them separately
          book_id = data[subinput]._id;

          console.log("Please enter new data for " + data[subinput].title);

          // Gather Book Data
          book = {}
          subinput = await ask("Title > ");
          if (subinput) { book.title = subinput; }
          console.log("Enter Author(s) one per line:");
          book.authors = [];
          subinput = -1;
          while (subinput) {
            subinput = await ask("Author > ");
            if (subinput) {
              book.authors.push(subinput);
            }
          }
          if (!book.authors.length) {
            delete book.authors;
          }
          console.log("Enter Genre(s) one per line:");
          book.genres = [];
          subinput = -1;
          while (subinput) {
            subinput = await ask("Genre > ");
            if (subinput) {
              book.genres.push(subinput);
            }
          }
          if (!book.genres.length) {
            delete book.genres;
          }
          subinput = await ask("Description > ");
          if (subinput) { book.description = subinput; }
          subinput = await ask("ISBN-10 > ");
          if (subinput) { book.isbn_10 = subinput; }
          subinput = await ask("ISBN-13 > ");
          if (subinput) { book.isbn_13 = subinput; }
          // End Gather Book Data

          data = await update_book(session._id, book_id, book);
          if (data.success) {
            console.log("Book successfully updated");
          }
          else {
            console.log("Error updating book: " + data.error_message);
          }

        }
        else {
          console.log(data.error_message);
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
      `All:      Gets all books from the database` + "\n" +
      `Search:   Searches all fields for a book` + "\n" +
      `Add:      Adds book to database` + "\n" +
      `Remove:   Removes a book from database` + "\n" +
      `Update:   Updates a book with new data` + "\n" +
      `Exit:     Back to main menu`)
    selection = await ask("Option Selection > ")
    console.log();
  } while (selection.toLowerCase() != "exit");

  return session;
}