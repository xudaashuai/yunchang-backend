import { addMilliseconds, addMonths } from "date-fns";
import Express from "express";
import { MongoClient } from "mongodb";
import { BillItem, MonthBill } from "./types";
const app = Express();

app.use(Express.json());
app.use(
  Express.urlencoded({
    extended: true,
  })
);

const uri = "mongodb://admin:admin@mongo:27017/";
const dbClient = (await new MongoClient(uri).connect()).db("yunchang");

app.get("/getAllCategories", async (req, res) => {
  res.json(await dbClient.collection("category").find().toArray());
});

app.post("/batchLoadMonthBills", async (req, res) => {
  const { startMonth, startYear, endMonth, endYear } = req.body || {};
  if (startYear > endYear || (startYear === endYear && startMonth > endMonth)) {
    res.status(400).json({
      message: "input invalid",
    });
    return;
  }
  let tsStart = new Date(startYear, startMonth, 1);
  let tsEnd = addMilliseconds(addMonths(new Date(endYear, endMonth, 1), 1), -1);
  let bills = await dbClient
    .collection<BillItem>("bill")
    .find({
      time: {
        $gte: tsStart.valueOf(),
        $lt: tsEnd.valueOf(),
      },
    })
    .toArray();

  const response: MonthBill[] = [];
  while (tsStart < tsEnd) {
    const month = tsStart.getMonth();
    const year = tsStart.getFullYear();
    const monthBills = bills
      .filter((bill) => {
        return (
          new Date(bill.time).getMonth() === month &&
          new Date(bill.time).getFullYear() === year
        );
      })
      .map((bill) => {
        return {
          type: bill.type,
          time: new Date(bill.time).getTime(),
          categoryId: bill.categoryId,
          amount: bill.amount,
        };
      })
      .sort((a, b) => a.time - b.time);
    response.push({
      year,
      month,
      bills: monthBills,
    });
    if (tsStart.getFullYear() === endYear && tsStart.getMonth() === endMonth) {
      break;
    }
    tsStart = addMonths(tsStart, 1);
  }
  res.json(response);
});

app.post("/createBill", async (req, res) => {
  const result = await dbClient.collection("bill").insertOne({
    type: req.body.type,
    time: req.body.time,
    category: req.body.category,
    amount: req.body.amount,
  });

  res.status(result.insertedId ? 200 : 500);
});

app.listen(8080);
