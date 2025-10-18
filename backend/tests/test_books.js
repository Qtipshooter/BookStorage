// test_books.js
// Quinton Graham
// Tests the books.js functions

import { add_book } from "../api/books.js";
import { get_user } from "../api/users.js";
import { get_ObjectID } from "../api/util.js";
import { util_check_test } from "./util_test.js";


async function test_add_book() {
  // Init
  let passing = true;

  // Test Cases
  let test_cases = [];
  let valid_uids = [];
  let usernames = [
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
      description: "Valid Book #1 that meets all the requirements",
      isbn_10: "1111111111",
      isbn_13: "1111111111111",
    },
    {
      title: "Valid Book 2",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #2 that meets all the requirements",
      isbn_10: "2222222222",
      isbn_13: "2222222222222",
    },
    {
      title: "Valid Book 3",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #3 that meets all the requirements",
      isbn_10: "3333333333",
      isbn_13: "3333333333333",
    },
    {
      title: "Valid Book 4",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #4 that meets all the requirements",
      isbn_10: "4444444444",
      isbn_13: "4444444444444",
    },
    {
      title: "Valid Book 5",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #5 that meets all the requirements",
      isbn_10: "5555555555",
      isbn_13: "5555555555555",
    },
    {
      title: "Valid Book 6",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #6 that meets all the requirements",
      isbn_10: "6666666666",
      isbn_13: "6666666666666",
    },
    {
      title: "Valid Book 7",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #7 that meets all the requirements",
      isbn_10: "7777777777",
      isbn_13: "7777777777777",
    },
    {
      title: "Valid Book 8",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #8 that meets all the requirements",
      isbn_10: "8888888888",
      isbn_13: "8888888888888",
    },
    {
      title: "Valid Book Same",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #9 that meets all the requirements",
      isbn_10: "9999999999",
      isbn_13: "9999999999999",
    },
    {
      title: "Valid Book Same",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #0 that meets all the requirements",
      isbn_10: "0000000000",
      isbn_13: "0000000000000",
    },
    {
      title: "Valid Book Not Inputed",
      authors: ["Author None"],
      genres: ["Horro"],
      description: "Valid Book that meets all the requirements, but is not inserted due to other invalid request factors",
      isbn_10: "1000000000",
      isbn_13: "1000000000000",
    },
    {
      title: "Valid Book Not Inputed",
      authors: ["Author None"],
      genres: ["Horro"],
      description: "Valid Book that meets all the requirements, but is not inserted due to other invalid request factors",
      isbn_10: "2000000000",
      isbn_13: "2000000000000",
    },
    {
      title: "Valid Book Not Inputed",
      authors: ["Author None"],
      genres: ["Horro"],
      description: "Valid Book that meets all the requirements, but is not inserted due to other invalid request factors",
      isbn_10: "3000000000",
      isbn_13: "3000000000000",
    },
    {
      title: "Valid Book Not Inputed",
      authors: ["Author None"],
      genres: ["Horro"],
      description: "Valid Book that meets all the requirements, but is not inserted due to other invalid request factors",
      isbn_10: "4000000000",
      isbn_13: "4000000000000",
    },
    {
      title: "Valid Book Not Inputed",
      authors: ["Author None"],
      genres: ["Horro"],
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
      description: "Invalid Book #3 with missing data",
      isbn_10: "1111111111",
      isbn_13: "9898989898989",
    },
    {
      title: "Invalid Book 4",
      genres: ["Horror"],
      description: "Invalid Book #4 with missing data",
      isbn_10: "9898989898",
      isbn_13: "1111111111111",
    },
    {
      title: "Invalid Book 5",
      authors: "Author 1",
      genres: ["Horror"],
      description: "Invalid Book #5 with misformated data",
      isbn_10: "1111111111",
      isbn_13: "9898989898989",
    },
    {
      title: "Invalid Book 6",
      authors: ["Author 1"],
      genres: "Horror",
      description: "Invalid Book #6 with misformated data",
      isbn_10: "9898989898",
      isbn_13: "1111111111111",
    },
    {
      title: "Invalid Book 7",
      authors: ["Author 1"],
      genres: ["Horror"],
      description: "Invalid Book #7 with misformated data",
      isbn_10: 100000001,
      isbn_13: "9898989898989",
    },
    {
      title: "Invalid Book 8",
      authors: ["Author 1"],
      genres: ["Horror"],
      description: "Invalid Book #8 with misformated data",
      isbn_10: "9898989898",
      isbn_13: 100000000001,
    },
    {
      description: "Invalid Book #9 with missing data",
    },
  ]

  // Fill IDs
  for (let i = 0; i < usernames.length; i++) {
    let user = await get_user(usernames[i]);
    if(user.success) {
      valid_uids.push(user.data._id.toString())
    }
  }

  // Valid Test Cases
  for(let i = 0; i < 10 /* Inserted valid books */; i++) {
    test_cases.push({
      uid: valid_uids[i % valid_uids.length],
      book: valid_books[i],
      cond: true,
    })
  }

  // Invalid Cases //
  // Duplicate Books
  test_cases.push([
    {
      uid: valid_uids[0],
      book: valid_books[0],
      cond: false,
    },
    {
      uid: valid_uids[1],
      book: valid_books[2],
      cond: false,
    }
  ])
  // Invalid User, valid book
  for(let i = 0; i < invalid_uids.length && i < 5 /* Valid Book limit */; i++) {
    test_cases.push({
      uid: invalid_uids[0],
      book: valid_books[i+10],
      cond: false,
    })
  }
  // Duplicate ISBN, Missing and Improper Book Data
  for(let i = 0; i < invalid_books.length; i++) {
    test_cases.push({
      uid: valid_uids[i % valid_uids.length],
      book: invalid_books[i],
      cond: false,
    })
  }

  // Run Tests
  console.log("-- Testing add_book --");
  for (let i = 0; i < test_cases.length; i++) {
    await add_book(test_cases[i].uid, test_cases[i].book).then((res) => {util_check_test(res, test_cases[i].cond, i+1)});
  }
  console.log("-- Test add_book complete --");
  // Return output
  return passing;
}

async function test_get_book() {}

export async function test_books() {
  await test_add_book();
}