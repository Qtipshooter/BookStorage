// test_books.js
// Quinton Graham
// Tests the books.js functions

import { add_book, update_book, update_book_owner, delete_book, get_book, get_books, search_books } from "../api/books.js";
import { get_user } from "../api/users.js";
import { get_ObjectID } from "../api/util.js";
import { util_check_test, ask } from "./util_test.js";


async function test_add_book() {
  // Init
  let passing = true;

  // Test Cases
  let test_cases = [];
  let valid_uids = [];
  let valid_usernames = [
    "admin",
    "JohnDoe1",
    "fancy+email@email.co.uk",
  ]
  let invalid_uids = [
    get_ObjectID("f9f9f9f9f9f9f9f9f9f9f9f9"),
    "f9f9f9f9f9f9f9f9f9f9f9f9",
    "JohnDoe1",
    "admin",
  ]
  let valid_books = [
    {
      title: "Valid Book 1",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #1 that meets all the defaults",
      isbn_10: "1111111111",
      isbn_13: "1111111111111",
    },
    {
      title: "Valid Book 2",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #2 that meets all the defaults",
      isbn_10: "2222222222",
      isbn_13: "2222222222222",
    },
    {
      title: "Valid Book 3",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #3 that meets all the defaults",
      isbn_10: "3333333333",
      isbn_13: "3333333333333",
    },
    {
      title: "Valid Book 4",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #4 that has no ISBN",
    },
    {
      title: "Valid Book 5",
      authors: ["Author 1"],
      genres: "Fantasy",
      description: "Valid Book #5 that has improper genre format",
      isbn_10: "5555555555",
      isbn_13: "5555555555555",
    },
    {
      title: "Valid Book 6",
      authors: ["Author A", "Author B"],
      genres: ["Fantasy"],
      description: "Valid Book #6 that has multiple authors",
      isbn_10: "6666666666",
      isbn_13: "6666666666666",
    },
    {
      title: "Valid Book 7",
      authors: ["Author 1"],
      genres: ["Fantasy", "Romance"],
      description: "Valid Book #7 that has multiple genres",
      isbn_10: "7777777777",
      isbn_13: "7777777777777",
    },
    {
      title: "Valid Book 8",
      authors: ["Author 1"],
      description: "Valid Book #8 that has the bare minimum (minus this description)",
    },
    {
      title: "Valid Book Same",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #9 that has the same name as the next book",
      isbn_10: "9999999999",
      isbn_13: "9999999999999",
    },
    {
      title: "Valid Book Same",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #0 that has the same name as the previous book",
      isbn_10: "0000000000",
      isbn_13: "0000000000000",
    },
    {
      title: "Valid Book Not Inputed",
      authors: ["Author None"],
      genres: ["Horror"],
      description: "Valid Book that meets all the requirements, but is not inserted due to other invalid request factors",
      isbn_10: "1000000000",
      isbn_13: "1000000000000",
    },
    {
      title: "Valid Book Not Inputed",
      authors: ["Author None"],
      genres: ["Horror"],
      description: "Valid Book that meets all the requirements, but is not inserted due to other invalid request factors",
      isbn_10: "2000000000",
      isbn_13: "2000000000000",
    },
    {
      title: "Valid Book Not Inputed",
      authors: ["Author None"],
      genres: ["Horror"],
      description: "Valid Book that meets all the requirements, but is not inserted due to other invalid request factors",
      isbn_10: "3000000000",
      isbn_13: "3000000000000",
    },
    {
      title: "Valid Book Not Inputed",
      authors: ["Author None"],
      genres: ["Horror"],
      description: "Valid Book that meets all the requirements, but is not inserted due to other invalid request factors",
      isbn_10: "4000000000",
      isbn_13: "4000000000000",
    },
    {
      title: "Valid Book Not Inputed",
      authors: ["Author None"],
      genres: ["Horror"],
      description: "Valid Book that meets all the requirements, but is not inserted due to other invalid request factors",
      isbn_10: "5000000000",
      isbn_13: "5000000000000",
    },
  ]
  let invalid_books = [
    {
      title: "Invalid Book 1",
      authors: ["Author 1"],
      genres: ["Horror"],
      description: "Invalid Book #1 with duplicate ISBN-10",
      isbn_10: "1111111111",
      isbn_13: "9898989898989",
    },
    {
      title: "Invalid Book 2",
      authors: ["Author 1"],
      genres: ["Horror"],
      description: "Invalid Book #2 with duplicate ISBN-13",
      isbn_10: "9898989898",
      isbn_13: "1111111111111",
    },
    {
      authors: ["Author 1"],
      genres: ["Horror"],
      description: "Invalid Book #3 with missing data title",
      isbn_10: "1111111111",
      isbn_13: "9898989898989",
    },
    {
      title: "Invalid Book 4",
      genres: ["Horror"],
      description: "Invalid Book #4 with missing data author",
      isbn_10: "9898989898",
      isbn_13: "1111111111111",
    },
    {
      title: "Invalid Book 5",
      authors: "Author 1",
      genres: ["Horror"],
      description: "Invalid Book #5 with misformated improper author format",
      isbn_10: "1111111111",
      isbn_13: "9898989898989",
    },
    {
      description: "Invalid Book #8 with missing data",
    },
  ]

  // Fill IDs
  for (let i = 0; i < valid_usernames.length; i++) {
    let user = await get_user(valid_usernames[i]);
    if (user.success) {
      valid_uids.push(user.data._id.toString())
    }
  }

  // Valid Test Cases
  for (let i = 0; i < 10 /* Inserted valid books */; i++) {
    test_cases.push({
      uid: valid_uids[i % valid_uids.length],
      book: valid_books[i],
      cond: true,
    })
  }

  // Invalid Cases //
  // Duplicate Books
  test_cases.push({
    uid: valid_uids[0],
    book: valid_books[0],
    cond: false,
  });
  test_cases.push({
    uid: valid_uids[1],
    book: valid_books[2],
    cond: false,
  });
  // Invalid User, valid book
  for (let i = 0; i < invalid_uids.length && i < 5 /* Valid Book limit */; i++) {
    test_cases.push({
      uid: invalid_uids[i],
      book: valid_books[i + 10],
      cond: false,
    })
  }
  // Duplicate ISBN, Missing and Improper Book Data
  for (let i = 0; i < invalid_books.length; i++) {
    test_cases.push({
      uid: valid_uids[i % valid_uids.length],
      book: invalid_books[i],
      cond: false,
    })
  }

  // Run Tests
  console.log("-- Testing add_book --");
  for (let i = 0; i < test_cases.length; i++) {
    await add_book(test_cases[i].uid, test_cases[i].book).then((res) => { util_check_test(res, test_cases[i].cond, i + 1) });
  }
  console.log("-- Test add_book complete --");
  // Return output
  return passing;
}

async function test_get_book() {
  // Init
  let passing = true;

  // Test Cases
  const test_cases = [
    {
      book_id: "68f3df000000000000000001",
      cond: true,
    },
    {
      book_id: "68f3df000000000000000009",
      cond: true,
    },
    {
      book_id: "aaaaaa000000000000000000",
      cond: false,
    },
    {
      book_id: "Default Book 01",
      cond: false,
    },
    {
      book_id: "8080000010",
      cond: false,
    },
  ]

  // Run Tests
  console.log("-- Testing get_book --");
  for (let i = 0; i < test_cases.length; i++) {
    await get_book(test_cases[i].book_id).then((res) => { util_check_test(res, test_cases[i].cond, i + 1) });
  }
  console.log("-- Test get_book complete --");

  // Return Output
  return passing;
}

export async function test_books() {
  await test_add_book();
  await test_get_book();
}

export async function menu_test_books() {
  let selection = "reset";
  let data = null;
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
        if(data.success) {
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
        console.log("Work in progress . . .");
        break;

      case "remove":
        console.log("Work in progress . . .");
        break;

      case "update":
        console.log("Work in progress . . .");
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
}