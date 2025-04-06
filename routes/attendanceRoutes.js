const express = require('express');
const { markAttendance, getAttendancePercentage } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/mark', protect, markAttendance); //  Only logged-in teachers can mark attendance
router.get('/:studentId', getAttendancePercentage); //  Students can check their attendance

module.exports = router;
