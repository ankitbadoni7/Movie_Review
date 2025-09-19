// db.js
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://alexnorton:ankalex29@theabmoviereview.n2s9vzw.mongodb.net/?retryWrites=true&w=majority&appName=theabmoviereview"; // Atlas se milne wala connection string

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected!");
    return client.db("MovieDB"); // yaha apne database ka naam likhna
  } catch (err) {
    console.error(err);
  }
}

module.exports = connectDB;
