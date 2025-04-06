const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const addStudent = async (req, res) => {
    try {
        const { name, email, password, teacherId,subject,phone } = req.body;

        if (!teacherId) {
            return res.status(400).json({ message: "Teacher ID is required" });
        }

        let student = await Student.findOne({ email });
        if (student) return res.status(400).json({ message: "Student already exists" });

        student = new Student({ name, email, password, teacherId ,subject,phone}); // teacherId add karo
        await student.save();

        res.status(201).json({ message: "Student added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


//  Student Login
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        //  Debugging - Print entered email & password
        console.log(" Entered Email:", email);
        console.log(" Entered Password:", password);

        // Find student by email
        const student = await Student.findOne({ email });
        if (!student) {
            console.log(" Student not found in database!");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        //  Debugging - Print stored hashed password
        console.log(" Stored Hashed Password:", student.password);

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, student.password);
        console.log(" Password Match:", isMatch);

        if (!isMatch) {
            console.log(" Password did not match!");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, studentId: student._id });
    } catch (error) {
        console.error("🚨 Server Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};
//  Get Students by Teacher ID
const getStudentsByTeacher = async (req, res) => {      // new
    try {
        const { teacherId } = req.params;

        // 🛠 Debugging - Print teacherId
        console.log(" Fetching students for teacher:", teacherId);

        const students = await Student.find({ teacherId });

        if (!students.length) {
            return res.status(404).json({ message: "No students found" });
        }

        res.json(students);
    } catch (error) {
        console.error(" Error fetching students:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};    // new




const getStudentDetails = async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await Student.findById(studentId).select("-password"); // Exclude password

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        console.error("❌ Error fetching student details:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { addStudent, loginStudent, getStudentDetails, getStudentsByTeacher  };

// Route in Express
//router.get("/student/:studentId", getStudentDetails);
//  Export both functions
// module.exports = { addStudent, loginStudent };

