import { test_all } from "./src/backend/tests/test_all.js";
import { util_seed_test_database } from "./src/backend/tests/util_test.js";

// TODO Seed Database for test state
await util_seed_test_database()

// Run Tests
await test_all();

// Tests over, close connection
process.exit();