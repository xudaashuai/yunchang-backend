import Express from "express";
import { MongoClient } from "mongodb";
const app = Express();

const uri = "mongodb://admin:admin@mongo:27017/";
const dbClient = await new MongoClient(uri).connect();

app.get("/getAllCategories", async (req, res) => {
  res.json(
    await dbClient.db("yunchang").collection("categories").find().toArray()
  );
});
app.get("/batchLoadMonthBills", (req, res) => {
  res.json(dbClient.db("yunchang").collection("categories").find().toArray());
});

app.listen(8080);
