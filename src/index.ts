import Express from "express";
import { MongoClient } from "mongodb";
const app = Express();

const uri = "mongodb+srv://adimn：admin@mongo:27017/";

const dbClient = new MongoClient(uri);

app.get("/getAllCategories", (req, res) => {
  res.json([]);
});
app.listen(8080);
