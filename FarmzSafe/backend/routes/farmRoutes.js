const express = require('express');
const{AddFarm, deleteFarm, getFarms, getFarmById, editFarm, addAnimalToFarm, updateAnimalInFarm} = require("../controllers/farmController");

const router = express.Router();


router.post('/AddFarm', AddFarm);

router.get('/getFarms', getFarms);

router.delete('/deleteFarm/:id', deleteFarm);

router.put('/editFarm/:id', editFarm);

router.get('/getfarmbyID/:id', getFarmById);

router.post('/addanimal/:farmId', addAnimalToFarm);

router.put('/updateanimal/:farmId/:animalId', updateAnimalInFarm);

module.exports= router;