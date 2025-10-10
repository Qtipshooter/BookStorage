import dotenv from "dotenv"
import { MongoClient, ObjectId } from "mongodb";
dotenv.config({path: ".env.test"});

// Used for test formatting
export function util_test_result_code(result) {
  if(result == "pass") {
    return "[\x1b[32mPass\x1b[0m]"
  }
  if(result == "fail") {
    return "[\x1b[31mFail\x1b[0m]"
  }
  if(result == "info") {
    return "[\x1b[33mInfo\x1b[0m]"
  }
  return "";
}

export async function util_seed_test_database() {
  // Drop Databases
  const connection_string = process.env.CONNECTION_STRING + process.env.DATABASE_NAME;
  const client = new MongoClient(connection_string);
  await client.connect();
  console.log("Dropping previous test Database");
  const db = client.db();
  try{
    const result = await db.dropDatabase();
    console.log(util_test_result_code("info") + " Database Dropped")
  }
  catch (err) {
    console.log("Error Dropping DB: " + err);
    return {
      success: false,
      error_message: "Error Dropping DB: " + err,
    }
  }

  // Add Default User Table
  const users_col = db.collection("users");
  const create_date = new Date();
  const users = [
    {
      display_name: "admin",
      username: "admin",
      primary_email: "admin@admin.com",
      hashcode: "$2b$12$XWYDiTIWlBQJt6rPutIrr.MP4Te4nrgfLqs2C9tjMQwCoI5FCNRvS",
      created_date: create_date,
      level: "admin"
    },
    {
      display_name: "dev",
      username: "dev",
      primary_email: "dev@admin.com",
      hashcode: "$2b$12$xPrENs.TSMlkTsUO58xNSeSdjOMIvb.07qjII28Rgs/3wctKqIwp6",
      created_date: create_date,
      level: "admin"
    },
    {
      display_name: "JohnDoe1",
      username: "johndoe1",
      primary_email: "john.doe@email.com",
      hashcode: "$2b$12$COqGkMrJB2X.VkG6cqrinu3KMG2eg3AJO0RI3xp08IxO3siA8lcCG",
      created_date: create_date,
      level: "user"
    },
    {
      display_name: "Jane_Doe",
      username: "jane_doe",
      primary_email: "jane.doe@email.com",
      hashcode: "$2b$12$Dc1GN4WHAB/vgk/P3O0ueeXhOeexcsrzfqpJu12rfsHwDgUyp3Eeu",
      created_date: create_date,
      level: "user"
    },
    {
      display_name: "Sara_Codes",
      username: "sara_codes",
      primary_email: "fancy+email@email.co.uk",
      hashcode: "$2b$12$u8gQfSuADBuhI1N2GmAQtOTvrVyPu/INgNwxo.AbH85jpuPHDDm7e",
      created_date: create_date,
      level: "user"
    },
    {
      display_name: "Sagar0cean",
      username: "sagar0cean",
      primary_email: "0cean@email.com",
      hashcode: "$2b$12$.TB0PCDmrVqP1NsHhAoEYu/NbT2UyloGdyU8CdjH.Es0uL3dSlXui",
      created_date: create_date,
      level: "user"
    },
    {
      display_name: "PETER",
      username: "peter",
      primary_email: "drips@peters.gov",
      hashcode: "$2b$12$.BqF7SUOBPzCKVVu8pVuSeVv.Qu8pI7uDgwoKRR66PW.QAegUKMTi",
      created_date: create_date,
      level: "user"
    },
    {
      display_name: "George",
      username: "george",
      primary_email: "yellowhat@man.com",
      hashcode: "$2b$12$KnKB47Gk.JmmWCCyiohqzOvI8ok8bQVgVRL85AN5AmLuq4gv5aHT.",
      created_date: create_date,
      level: "user"
    },
  ]
  await users_col.insertMany(users)
}