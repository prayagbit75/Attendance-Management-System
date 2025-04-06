const express = require("express");
const { addStudent, loginStudent, getStudentDetails, getStudentsByTeacher } = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Fix: Move this route above `/:teacherId`
// router.get("/student/:studentId", getStudentDetails); 
router.get("/student/:studentId", getStudentDetails);  

//  Get students by teacher ID
router.get("/teacher/:teacherId", getStudentsByTeacher);

//  Student Registration (Only Teachers can add students)
router.post("/add", protect, addStudent);

//  Student Login
router.post("/login", loginStudent);

module.exports = router;
