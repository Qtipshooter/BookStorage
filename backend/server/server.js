// server.js
// Quinton Graham
// Server for the Book Storage program

import dotenv from "dotenv"
const envpath = `.env${process.env.NODE_ENV || ""}`;
dotenv.config({ path: envpath })

import express from "express";
import api from "./routes/api.js";


const app = express();
const port = Number(process.env.PORT) || 3000;

app.use((req, res, next) => {
  // TODO Logging
  console.log(req.url);
  next();
});

app.use(express.json());
app.use("/api", api);


app.get("/", (request, response) => {
  response.send("Hello from the server");
});

app.listen(port, () => { console.log("Server Started: Port " + port) });