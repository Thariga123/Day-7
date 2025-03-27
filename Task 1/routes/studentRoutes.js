const express = require('express');
const { addStudent } = require('../controllers/studentController');
const router = express.Router();


router.post('/', addStudent);

module.exports = router;
