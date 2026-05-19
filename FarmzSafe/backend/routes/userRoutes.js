const express = require('express');
const { SignUpUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// POST /api/Signup
router.post('/Signup', SignUpUser) ;

// POST /api/Users/Login
router.post('/Login', loginUser);

module.exports = router;
