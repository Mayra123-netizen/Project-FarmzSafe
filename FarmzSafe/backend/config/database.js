// config/database.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://lemayraa1_db_user:olanem123@ac-l68f4xo-shard-00-00.3uxr7xa.mongodb.net:27017,ac-l68f4xo-shard-00-01.3uxr7xa.mongodb.net:27017,ac-l68f4xo-shard-00-02.3uxr7xa.mongodb.net:27017/?ssl=true&replicaSet=atlas-zf3est-shard-0&authSource=admin&appName=Cluster0");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
