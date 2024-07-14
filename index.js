import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "ToDoOrganizer",
  password: process.env.db_password,
  port: 5433
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function fetchItems(){
  const result = await db.query("SELECT * FROM items");
  return result.rows;
}

app.get("/", async (req, res) => {
  const toDoList = await fetchItems();
  console.log(toDoList)
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: toDoList,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
