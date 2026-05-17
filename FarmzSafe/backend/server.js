require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require("./config/database");
const userRoute = require('./routes/userRoutes');
const farmRoute = require('./routes/farmRoutes');
const vaccineRoute = require('./routes/vaccineRoutes');
const reportRoute = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB(); 

// Routes
app.use('/api/Users', userRoute);
app.use('/api/farms', farmRoute);
app.use('/api/Vaccine', vaccineRoute);
app.use('/api/Report', reportRoute);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// hello