require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require("./config/database");


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());


connectDB(); 


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// hello