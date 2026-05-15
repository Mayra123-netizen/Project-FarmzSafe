const express = require('express');
const router = express.Router();
const { 
  createFarm, 
  getFarms, 
  createReport, 
  getReports, 
  getUsers 
} = require('../controllers/controller');

// Farm Routes
router.route('/farms')
  .get(getFarms)
  .post(createFarm);

// Safety Report Routes
router.route('/reports')
  .get(getReports)
  .post(createReport);

// User Routes
router.get('/users', getUsers);

module.exports = router;
