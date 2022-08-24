import Express from "express";
import { MongoClient } from "mongodb";
const app = Express();

const uri = "mongodb://adimn:admin@mongo:27017/";
const dbClient = await new MongoClient(uri).connect();
app.get("/getAllCategories", (req, res) => {
  res.json(dbClient.db("test").collection("categories").find().toArray());
});
app.listen(8080);
