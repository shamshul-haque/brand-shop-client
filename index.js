const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const productCollection = client.db("phoneHubDB").collection("product");
    const cartCollection = client.db("phoneHubDB").collection("cart");

    // Insert single brand into brand collection
    app.post("/brand", async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    });

    // Find all brands from brand collection
    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Insert products into product collection
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // Find all product from product collection
    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Find all product from product database based on brand categories
    app.get("/product/:brand_name", async (req, res) => {
      const brandName = req.params.brand_name;
      const cursor = productCollection.find({ brand_name: brandName });
      const result = await cursor.toArray();
      res.send(result);
    });

    // Find single product from product collection based on product id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // Update single existing product from product collection based on product id
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      console.log({ updateProduct, id });
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updated = {
        $set: {
          product_name: updateProduct.product_name,
          product_img: updateProduct.product_img,
          brand_name: updateProduct.brand_name,
          type: updateProduct.type,
          price: updateProduct.price,
          rating: updateProduct.rating,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updated,
        options
      );
      res.send(result);
    });

    // Insert single product into cart collection
    app.post("/cart", async (req, res) => {
      const cart = req.body;
      console.log(cart);
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });

    // Find all selected product from cart collection
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Find all product from cart collection based on email
    app.get("/cart/:email", async (req, res) => {
      const emailAddr = req.params.email;
      const cursor = cartCollection.find({ email: emailAddr });
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete single product from cart collection
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
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
