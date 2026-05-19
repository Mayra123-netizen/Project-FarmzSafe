const express = require('express');
const{ getReports, addReport, editReport, deleteReport } = require("../controllers/reportController");

const router = express.Router();

router.get('/getReports', getReports);

router.delete('/deleteReport/:id', deleteReport);

router.put('/editReport/:id', editReport);

router.post('/addReport', addReport);

module.exports = router;