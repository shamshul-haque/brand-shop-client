const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connecting uri
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.gwehrjf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    // await client.connect();

    // Connect to the "phoneHubDB" database and access its "user" collection
    const brandCollection = client.db("phoneHubDB").collection("brand");

    // Insert brand into database
    app.post("/brand", async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
