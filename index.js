const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dqh9x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("task_portal").collection("tasks");

    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send({ success: true, result });
    });
    app.get("/task/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const tasks = await taskCollection.find(query).toArray();
      res.send(tasks);
    });
    app.put("/task/complete/:id", async (req, res) => {
        const id = req.params.id;
        const filter = {  _id: ObjectId(id) };
        const updateDoc = {
          $set: { status: "done" },
        };
        const result = await taskCollection.updateOne(filter, updateDoc);
        res.send(result);
      });
    app.delete("/task/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await taskCollection.deleteOne(filter);
        res.send(result);
      });
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello from To Do App");
});
app.listen(port, () => {
  console.log(`To do app listening on port: ${port}`);
});
