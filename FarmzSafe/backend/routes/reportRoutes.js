const express = require('express');
const{ getReports, addReport, editReport, deleteReport } = require("../controllers/reportController");

const router = express.Router();

router.get('/getReports', getReports);

router.delete('/deleteReport',deleteReport);

router.put('/editReport', editReport);

router.post('/addReport',addReport);

module.exports = router;