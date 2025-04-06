const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc Register Teacher
const registerTeacher = async (req, res) => {
    try {
        const { name, email, password} = req.body;  

        // Check if teacher already exists
        let teacher = await Teacher.findOne({ email });
        if (teacher) return res.status(400).json({ message: "Teacher already exists" });
         
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new teacher
        teacher = new Teacher({ name, email, password: hashedPassword });
        await teacher.save();

        res.status(201).json({ message: "Teacher registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// @desc Login Teacher
const loginTeacher = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if teacher exists   
        const teacher = await Teacher.findOne({ email });
        if (!teacher) return res.status(400).json({ message: "Invalid credentials" });

        // Compare password
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, teacherId: teacher._id });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { registerTeacher, loginTeacher };
