import "dotenv/config"
import { MongoClient } from "mongodb"

const connection_string = process.env.CONNECTION_STRING;
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
