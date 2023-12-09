const express = require('express');
const router = express.Router();

const {signup, login} = require('../controllers/AuthController');

// POST localhost:3000/users/signup
router.post('/signup', signup);

// POST localhost:3000/users/login
router.post('/login', login);


module.exports = router;
