import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import client from "./client";
import db from "./db/db";
import server from "./server";

console.log("dotenv");
console.log(db);

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/register", server);
app.use("/api", client);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
