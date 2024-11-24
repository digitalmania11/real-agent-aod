const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = "mongodb://localhost:27017/abuildhomesDB";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

const getDB = () => {
  return client.db("abuildhomesDB");
};

module.exports = { connectDB, getDB, client };