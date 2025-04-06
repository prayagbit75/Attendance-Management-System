const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); //  JSON data accept karega

const cors = require("cors");  
app.use(cors());  
 

//  Routes Import  
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require("./routes/studentRoutes");

//  Register Routes 
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes); 
  
//  Root API 
app.get('/', (req, res) => {    
    res.send('API is working!');
}); 

//attendace router  
const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/attendance', attendanceRoutes);


//  Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});


