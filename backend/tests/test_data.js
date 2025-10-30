// test_cases.js
// Quinton Graham
import { get_ObjectID } from "../api/util.js";
import bcrypt from "bcrypt";
const passes = Number(process.env.HASH_PASSES);
const create_date = new Date();

/** Initial Database State **/
const test_init_users = [
  {
    _id: get_ObjectID("aaaaaa000000000000000000"),
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
    _id: get_ObjectID("aaaaaa000000000000000001"),
    display_name: "JohnDoe1",
    username: "johndoe1",
    primary_email: "john.doe@email.com",
    hashcode: await bcrypt.hash("Password1", passes),
    created_date: create_date,
    level: "user"
  },
  {
    _id: get_ObjectID("aaaaaa000000000000000002"),
    display_name: "Jane_Doe",
    username: "jane_doe",
    primary_email: "jane.doe@email.com",
    hashcode: await bcrypt.hash("H4rd3rP@55word", passes),
    created_date: create_date,
    level: "user"
  },
  {
    _id: get_ObjectID("aaaaaa000000000000000003"),
    display_name: "Stewster",
    username: "stewster",
    primary_email: "stewster@email.com",
    hashcode: await bcrypt.hash("Passcoding1", passes),
    created_date: create_date,
    level: "user"
  },
  {
    _id: get_ObjectID("aaaaaa000000000000000004"),
    display_name: "Peters",
    username: "peters",
    primary_email: "peters@email.com",
    hashcode: await bcrypt.hash("Drippy3", passes),
    created_date: create_date,
    level: "user"
  },
]

const test_init_books = [
  {
    _id: get_ObjectID("68f3df000000000000000001"),
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    title: "Default Book 01",
    authors: ["Author 1"],
    genres: ["Fantasy"],
    description: "Default Book #01 that was already in the database",
    isbn_10: "0000000001",
    isbn_13: "0000000001000",
  },
  {
    _id: get_ObjectID("68f3df000000000000000002"),
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    title: "Default Book 02",
    authors: ["Author 1"],
    genres: ["Fantasy"],
    description: "Default Book #02 that was already in the database",
    isbn_10: "0000000002",
    isbn_13: "0000000002000",
  },
  {
    _id: get_ObjectID("68f3df000000000000000003"),
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    title: "Default Book 03",
    authors: ["Author 1"],
    genres: ["Fantasy"],
    description: "Default Book #03 that was already in the database",
    isbn_10: "0000000003",
    isbn_13: "0000000003000",
  },
  {
    _id: get_ObjectID("68f3df000000000000000004"),
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    title: "Default Book 04",
    authors: ["Author 1"],
    genres: ["Fantasy"],
    description: "Default Book #04 that was already in the database",
    isbn_10: "0000000004",
    isbn_13: "0000000004000",
  },
  {
    _id: get_ObjectID("68f3df000000000000000005"),
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    title: "Default Book 05",
    authors: ["Author 1"],
    genres: ["Fantasy"],
    description: "Default Book #05 that was already in the database",
    isbn_10: "0000000005",
    isbn_13: "0000000005000",
  },
  {
    _id: get_ObjectID("68f3df000000000000000006"),
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    title: "Default Book 06",
    authors: ["Author 2"],
    genres: ["Fantasy"],
    description: "Default Book #06 that was already in the database",
    isbn_10: "0000000006",
    isbn_13: "0000000006000",
  },
  {
    _id: get_ObjectID("68f3df000000000000000007"),
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    title: "Default Book 07",
    authors: ["Author 2"],
    genres: ["Fantasy"],
    description: "Default Book #07 that was already in the database",
    isbn_10: "0000000007",
    isbn_13: "0000000007000",
  },
  {
    _id: get_ObjectID("68f3df000000000000000008"),
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    title: "Default Book 08",
    authors: ["Author 2"],
    genres: ["Fantasy"],
    description: "Default Book #08 that was already in the database",
    isbn_10: "0000000008",
    isbn_13: "0000000008000",
  },
  {
    _id: get_ObjectID("68f3df000000000000000009"),
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    title: "Default Book 09",
    authors: ["Author 2"],
    genres: ["Fantasy"],
    description: "Default Book #09 that was already in the database",
    isbn_10: "0000000009",
    isbn_13: "0000000009000",
  },
]


/** Test Cases **/
/** User Tests **/
// Test Cases for register_user function
const test_cases_register_user = [
  {
    user: "AverageUser",
    email: "average.user@email.com",
    pass: "Sem1$ecure",
    cond: true,
  },
  {
    user: "Barbie",
    email: "foriegn.user@email.co.uk",
    pass: "Crikey2.0",
    cond: true,
  },
  {
    user: "Sagar",
    email: "savy.user@email.com",
    pass: "Pass 2 spaces! and a bunch of special characters: !@#$%^&*()_+{}|\"':\\/><?",
    cond: true,
  },
  {
    user: "A",
    email: "shortuser@email.com",
    pass: "Password1",
    cond: false,
  },
  {
    user: "ShortEmail",
    email: "a@a.a",
    pass: "Password1",
    cond: false,
  },
  {
    user: "JohnDoe1",
    email: "duplicate@email.com",
    pass: "Password1",
    cond: false,
  },
  {
    user: "John Doe 2",
    email: "space@email.com",
    pass: "Password1",
    cond: false,
  },
  {
    user: "SuperDuperLongUsernameLikeSuperLongNoReallyLikeTheSupercalifragilisticexpialidociouslyLongUsername",
    email: "long@email.com",
    pass: "NormalPassword1",
    cond: false,
  },
  {
    user: "InvalidEmail",
    email: "email@otheremail@email.com",
    pass: "Password1",
    cond: false,
  },
  {
    user: "ShortPassword",
    email: "short@password.com",
    pass: "Pass1",
    cond: false,
  },
  {
    user: "InvalidPassword1",
    email: "invalid1@password.com",
    pass: "AllLetterPassword",
    cond: false,
  },
  {
    user: "InvalidPassword2",
    email: "invalid2@password.com",
    pass: "1234567890987654321",
    cond: false,
  },
  {
    user: "DuplicateEmail",
    email: "john.doe@email.com",
    pass: "Password1",
    cond: false,
  },
];

// Test Cases for get_level function
const test_cases_get_level = [
  {
    user_id: get_ObjectID("aaaaaa000000000000000000"),
    cond: true,
  },
  {
    user_id: "aaaaaa000000000000000001",
    cond: true,
  },
  {
    user_id: get_ObjectID("aaaaaa000000000000000000"),
    cond: true,
  },
  {
    user_id: "aaaaaa000000000000000001",
    cond: true,
  },
  {
    user_id: get_ObjectID("aaaaaa006516300000000000"),
    cond: false,
  },
  {
    user_id: "aaaaaa006516300000000000",
    cond: false,
  },


];

// Test Cases for get_user function
const test_cases_get_user = [
  {
    username: "JohnDoe1",
    cond: true,
  },
  {
    username: "john.doe@email.com",
    cond: true,
  },
  {
    username: "Jane_Doe",
    cond: true,
  },
  {
    username: "foriegn.user@email.co.uk",
    cond: true,
  },
  {
    username: "NonExistantUsername",
    cond: false,
  },
  {
    username: get_ObjectID("aaaaaa000000000000000000"),
    cond: false,
  },
  {
    username: "aaaaaa000000000000000000",
    cond: false,
  },
];

// Test Cases for remove_user function
const test_cases_remove_user = [
  {
    user_id: get_ObjectID("aaaaaa000000000000000004"),
    cond: true,
  },
  {
    user_id: "aaaaaa000000000000000003",
    cond: true,
  },
  {
    user_id: "jane_doe",
    cond: false,
  },
  {
    user_id: "john.doe@email.com",
    cond: false,
  },
];

// Test Cases for authorize_user function
const test_cases_authorize_user = [
  {
    username: "JohnDoe1",
    password: "Password1",
    cond: true,
  },
  {
    username: "john.doe@email.com",
    password: "Password1",
    cond: true,
  },
  {
    username: "admin",
    password: "P@55C0d3s",
    cond: true,
  },
  {
    username: "admin@admin.com",
    password: "P@55C0d3s",
    cond: true,
  },
  {
    username: "JohnDoe1",
    password: "WrongPassword1",
    cond: false,
  },
  {
    username: "john.doe@email.com",
    password: "WrongPassword2",
    cond: false,
  },
  {
    username: "NonExistantUser",
    password: "Password1",
    cond: false,
  },
  {
    username: "nonexistant@email.com",
    password: "Password1",
    cond: false,
  },
  {
    username: get_ObjectID("aaaaaa000000000000000001"),
    password: "Password1",
    cond: false,
  },
];

// Test Cases for get_user_by_id function
const test_cases_get_user_by_id = [
  {
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    cond: true,
  },
  {
    user_id: get_ObjectID("aaaaaa000000000000000000"),
    cond: true,
  },
  {
    user_id: get_ObjectID("aaaaaa000000000000000aaa"),
    cond: false,
  },
  {
    user_id: "aaaaaa000000000000000001",
    cond: true,
  },
  {
    user_id: "aaaaaa000000000000000000",
    cond: true,
  },
  {
    user_id: "aaaaaa000000000000000aaa",
    cond: false,
  },
  {
    user_id: "JohnDoe1",
    cond: false,
  },
  {
    user_id: "john.doe@email.com",
    cond: false,
  },
];

/** Book Tests **/
// Test Cases for add_book function
const test_cases_add_book = [
  { 
    user_id: get_ObjectID("aaaaaa000000000000000001"),
    book: {
      title: "Valid Book 1",
      authors: ["Author 1"],
      genres: ["Fantasy"],
      description: "Valid Book #1 entered with object id for user",
      isbn_10: "1000000001",
      isbn_13: "1000000001000",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book: {
      title: "Valid Book 2",
      authors: ["Author 2"],
      genres: ["Fantasy"],
      description: "Valid Book #2 entered as typical example",
      isbn_10: "1000000002",
      isbn_13: "1000000002000",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book: {
      title: "Valid Book 3",
      authors: ["Author 3"],
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book: {
      title: "Valid Book 4",
      authors: ["Author 4", "Author A", "Dr. Seuss"],
      genres: ["Fantasy"],
      description: "Valid Book #4 entered with multiple authors",
      isbn_10: "1000000004",
      isbn_13: "1000000004000",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book: {
      title: "Valid Book 5",
      authors: ["Author 5"],
      genres: ["Fantasy", "Romance", "Adventure"],
      description: "Valid Book #5 entered with multiple genres",
      isbn_10: "1000000005",
      isbn_13: "1000000005000",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book: {
      title: "Valid Book 2",
      authors: ["Author 2"],
      genres: ["Fantasy"],
      description: "Valid Book #6 entered as a copy of Valid Book 2",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book: {
      title: "Invalid Book 1",
      authors: ["Author 1"],
      genres: ["Horror"],
      description: "Invalid Book #1 with duplicate ISBN10",
      isbn_10: "2000000001",
      isbn_13: "2000000001000",
    },
    cond: false,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book: {
      title: "Invalid Book 2",
      authors: ["Author 2"],
      genres: ["Horror"],
      description: "Invalid Book #2 with duplicate ISBN13",
      isbn_10: "2000000002",
      isbn_13: "2000000002000",
    },
    cond: false,
  },
  { 
    user_id: "aaaaaa000000000000000099",
    book: {
      title: "Invalid Book 3",
      authors: ["Author 3"],
      genres: ["Horror"],
      description: "Invalid Book #3 with Invalid User",
      isbn_10: "2000000003",
      isbn_13: "2000000003000",
    },
    cond: false,
  },
];

// Test Cases for update_book function
const test_cases_update_book = [
  { 
    user_id: "aaaaaa000000000000000001",
    book_id: "68f3df000000000000000001",
    updates: {
      title: "Updated Book 1",
      authors: ["Updated Author 1"],
      genres: ["Romance"],
      description: "Valid Book #1 entered with object id for user - Updated with Test",
      isbn_10: "3000000001",
      isbn_13: "3000000001000",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book_id: "68f3df000000000000000001",
    updates: {
      title: "Re-Updated Book 1",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book_id: "68f3df000000000000000001",
    updates: {
      authors: ["Author 1", "Updated Author 3"],
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book_id: "68f3df000000000000000001",
    updates: {
      genres: ["Fantasy", "Romance", "Dragons"],
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book_id: "68f3df000000000000000001",
    updates: {
      description: "Valid Book #1 entered with object id for user - Updated with Test - Then Updated Again",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book_id: "68f3df000000000000000001",
    updates: {
      isbn_10: "4000000001",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000001",
    book_id: "68f3df000000000000000001",
    updates: {
      isbn_13: "4000000001000",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000000",
    book_id: "68f3df000000000000000002",
    updates: {
      title: "Updated Book 2",
      authors: ["Updated Author 2"],
      genres: ["Dystopian"],
      description: "Valid Book #2 that was updated by the admin",
      isbn_10: "2000000001",
      isbn_13: "2000000001000",
    },
    cond: true,
  },

  { 
    user_id: "aaaaaa000000000000000000",
    book_id: "68f3df000000000000000002",
    updates: {
      isbn_10: "0000000001",
    },
    cond: false,
  },
  { 
    user_id: "aaaaaa000000000000000000",
    book_id: "68f3df000000000000000002",
    updates: {
      isbn_13: "0000000001000",
    },
    cond: false,
  },
  { 
    user_id: "aaaaaa000000000000000000",
    book_id: "68f3df000000000000000002",
    updates: {},
    cond: false,
  },
  { 
    user_id: "aaaaaa000000000000000003",
    book_id: "68f3df000000000000000002",
    updates: {
      title: "Invalid Updated Book 3",
      authors: ["Invalid Updated Author 3"],
      genres: ["Dystopian"],
      description: "Invalid Book Update #3 that someone other than the owner/admin attempted to update",
      isbn_10: "4000000003",
      isbn_13: "4000000003000",
    },
    cond: false,
  },
  { 
    user_id: "aaaaaa000000000000000000",
    book_id: "68f3df000000000000000002",
    updates: {
      title: "Valid Updated Book 4",
      authors: ["Valid Updated Author 4"],
      genres: ["Dystopian"],
      description: "Valid Book Update #4 has a bad ISBN (Bad Data Ommited)",
      isbn_10: "Numbers123",
      isbn_13: "4000000004000",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000000",
    book_id: "68f3df000000000000000002",
    updates: {
      title: "Valid Updated Book 5",
      authors: ["Valid Updated Author 5"],
      genres: ["Dystopian"],
      description: "Valid Book Update #5 has a bad ISBN (Bad Data Ommited)",
      isbn_10: "4000000005",
      isbn_13: "Numbers123456",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000000",
    book_id: "68f3df000000000000000003",
    updates: {
      title: "Valid Updated Book 6",
      authors: ["Valid Updated Author 6"],
      genres: ["Dystopian"],
      description: "Valid Book Update #6 has a wrong length ISBN (Bad Data Ommited)",
      isbn_10: "40000000061",
      isbn_13: "4000000006000",
    },
    cond: true,
  },
  { 
    user_id: "aaaaaa000000000000000000",
    book_id: "68f3df000000000000000003",
    updates: {
      title: "Valid Updated Book 7",
      authors: ["Valid Updated Author 7"],
      genres: ["Dystopian"],
      description: "Valid Book Update #7 has a wrong length ISBN (Bad Data Ommited)",
      isbn_10: "4000000007",
      isbn_13: "40000000070001",
    },
    cond: true,
  },
];

// Test Cases for update_book_owner function
const test_cases_update_book_owner = [
  {
    book_id: "68f3df000000000000000001",
    authorizing_user_id: "aaaaaa000000000000000001",
    new_user_id: "Jane_Doe",
    cond: true,
  },
  {
    book_id: "68f3df000000000000000001",
    authorizing_user_id: "aaaaaa000000000000000000",
    new_user_id: "foriegn.user@email.co.uk",
    cond: true,
  },
  {
    book_id: "68f3df000000000000000003",
    authorizing_user_id: "aaaaaa000000000000000002",
    new_user_id: "Jane_Doe",
    cond: true,
  },
  {
    book_id: "68f3df000000000000000004",
    authorizing_user_id: "john.doe@email.com",
    new_user_id: "aaaaaa000000000000000002",
    cond: false,
  },
];

// Test Cases for delete_book function
const test_cases_delete_book = [
  {
    user_id: "aaaaaa000000000000000000",
    book_id: "68f3df000000000000000009", 
    cond: true,
  },
  {
    user_id: "aaaaaa000000000000000001",
    book_id: "68f3df000000000000000008", 
    cond: true,
  },
  {
    user_id: "aaaaaa000000000000000002",
    book_id: "68f3df000000000000000007", 
    cond: false,
  },
  {
    user_id: "aaaaaa0000000000000000aa",
    book_id: "68f3df000000000000000006", 
    cond: false,
  },
  {
    user_id: "aaaaaa000000000000000000",
    book_id: "68f3df0000000000000000aa", 
    cond: false,
  },
];

// Test Cases for get_book function
const test_cases_get_book = [
  {
    book_id: "68f3df000000000000000001", 
    cond: true,
  },
  {
    book_id: "Valid Book 5", 
    cond: false,
  },
  {
    book_id: "68f3df000000000000000009", 
    cond: false,
  },
];

// Test Cases for get_books function
const test_cases_get_books = [
  {cond: true,}
];

// Test Cases for search_books function
const test_cases_search_books = [
  {
    search_term: "Valid",
    cond: true,
  },
  {
    search_term: "Author A",
    cond: true,
  },
  {
    search_term: "Invalid",
    cond: false,
  },
  {
    search_term: "68f3df000000000000000001",
    cond: false,
  },
  {
    search_term: "Admin",
    cond: true,
  },
];

export {
  test_init_users,
  test_init_books,
  test_cases_register_user,
  test_cases_get_level,
  test_cases_get_user,
  test_cases_remove_user,
  test_cases_authorize_user,
  test_cases_get_user_by_id,
  test_cases_add_book,
  test_cases_update_book,
  test_cases_update_book_owner,
  test_cases_delete_book,
  test_cases_get_book,
  test_cases_get_books,
  test_cases_search_books,
}