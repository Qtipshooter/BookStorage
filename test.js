import {test_all} from "./backend/tests/test_all.js";

// TODO Seed Database for test state

// Run Tests
await test_all();

// Tests over, close connection
process.exit();