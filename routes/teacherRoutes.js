const express = require('express');
const { registerTeacher, loginTeacher } = require('../controllers/teacherController');
const router = express.Router();

router.post('/register', registerTeacher); //  POST method hona chahiye
router.post('/login', loginTeacher);

module.exports = router;
