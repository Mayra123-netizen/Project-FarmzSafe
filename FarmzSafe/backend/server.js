require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require("./config/database");


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());

//routes
const userRoutes = require("./routes/userRoutes")
app.use("/api/User", userRoutes)
connectDB(); 


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
