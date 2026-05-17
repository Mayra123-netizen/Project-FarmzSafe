const express = require('express');
const{AddFarm, deleteFarm, getFarms, getFarmById, editFarm, addAnimalToFarm, updateAnimalInFarm} = require("../controllers/farmController");

const router = express.Router();


router.post('/AddFarm', AddFarm);

router.get('/getFarms', getFarms);

router.delete('/deleteFarm',deleteFarm);

router.put('/editFarm', editFarm);

router.get('/getfarmbyID', getFarmById);

router.post('/addanimal', addAnimalToFarm);

router.put('/updateanimal', updateAnimalInFarm);

module.exports= router;