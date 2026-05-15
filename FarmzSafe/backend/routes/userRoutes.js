const express = require('express');
const { SignUpUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// POST /api/users/Signup
router.post('/Signup', SignUpUser);

router.get('/Login', loginUser)

module.exports = router;
