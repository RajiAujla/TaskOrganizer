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

// function to fetch list from database
async function fetchItems(){
  const result = await db.query("SELECT * FROM items");
  return result.rows;
}

//fetch all the items of list
app.get("/", async (req, res) => {
  const toDoList = await fetchItems();
  console.log(toDoList)
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: toDoList,
  });
});

// addiing a new item to list
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
    try{
       const itemFound = await db.query("SELECT id FROM items where Lower(title) = $1",[item.toLowerCase()]);
       try{
        if(itemFound.rowCount == 0){
          await db.query("INSERT Into Items(title) values ($1)",[item]);
        }
       }catch(error){
        console.log("Insert error");
        console.log(error);
       }
    }catch(error){
      console.log("Itm not found")
      console.log(error);
    }
  res.redirect("/");
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
