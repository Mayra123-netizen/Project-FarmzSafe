const express = require('express');
const { SignUpUser, loginUser } = require('../controllers/userController');

const router = express.Router();


router.post('/Signup', SignUpUser) ;


router.post('/Login', loginUser);

module.exports = router;
