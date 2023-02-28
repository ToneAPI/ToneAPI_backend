import express from "express";
import client from "./client";
import server from "./server";

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
