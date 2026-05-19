const express = require('express');
const{getVaccines, editVaccine, deleteVaccine, addVaccine} = require("../controllers/vaccineController");

const router = express.Router();

router.get('/getVaccines', getVaccines);

router.delete('/deleteVaccine/:id', deleteVaccine);

router.put('/editVaccine/:id', editVaccine);

router.post('/addVaccine', addVaccine);

module.exports = router;
