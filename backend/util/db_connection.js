import dotenv from "dotenv"
import { MongoClient } from "mongodb"

const envpath = `.env${process.env.NODE_ENV || ""}`;
dotenv.config({path: envpath})

const connection_string = process.env.CONNECTION_STRING + process.env.DATABASE_NAME;
const client = new MongoClient(connection_string);

// shared connection
let db_connection = null;

export async function mdb_connect() {
  if (!db_connection) {
    await client.connect();
    db_connection = client.db('');
  }
  return db_connection;
}
