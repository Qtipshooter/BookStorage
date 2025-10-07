import { test_users } from "./test_users.js"

export async function test_all() {
  await test_users();
}