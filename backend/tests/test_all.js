import { test_books } from "./test_books.js";
import { test_users } from "./test_users.js";
import { util_test_result_code } from "./util_test.js";

export async function test_all() {
  let passing = true;
  if(!await test_users()) {passing = false;}
  if(!await test_books()) {passing = false;}
  console.log("\n" + util_test_result_code(passing ? "pass" : "fail") + " All Tests Complete\n");
  return passing;
}