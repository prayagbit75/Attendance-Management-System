const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');


const markAttendance = async (req, res) => {
    try {
        console.log("Received Data:", req.body);

        const { student, date, status } = req.body;

        //  Ensure studentId is converted to ObjectId
        const studentId = new mongoose.Types.ObjectId(student);  

        // Check if student exists
        const studentExists = await Student.findById(studentId);
        if (!studentExists) {
            return res.status(404).json({ message: "Student not found" });
        }

        //  Capitalize status to match enum values
        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        // Mark attendance
        const attendance = new Attendance({ student: studentId, date, status: formattedStatus });
        await attendance.save();

        res.status(201).json({ message: "Attendance marked successfully!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};


const getAttendancePercentage = async (req, res) => {
    try {
        const { studentId } = req.params;

        const totalClasses = await Attendance.countDocuments({ student: studentId });
        const presentClasses = await Attendance.countDocuments({ student: studentId, status: 'Present' });

        const percentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;
        let message = null;
                                                                               
        if (percentage < 75) {
            let neededClasses = 0;
            let newPercentage = percentage;

            while (newPercentage < 75) {
                neededClasses++;
                newPercentage = ((presentClasses + neededClasses) / (totalClasses + neededClasses)) * 100;
            }

            message = `You need to attend ${neededClasses} more consecutive classes to reach 75% attendance.`;
        }

        res.json({ 
            studentId, 
            totalClasses, 
            presentClasses, 
            attendancePercentage: percentage.toFixed(2),
            message
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};





module.exports = { markAttendance, getAttendancePercentage };
