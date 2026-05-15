require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require("./config/database");
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB(); 

// Routes
app.use('/api', routes);

// Base route
app.get('/', (req, res) => {
  res.send('FarmzSafe API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// hello