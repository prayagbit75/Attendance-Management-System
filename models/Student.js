const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },    // Username bhi yahi hoga
    password: { type: String, required: true },
    subject: {type:String,required:true},
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },  //  teacherId required hai
    // attendance: { type: Number, default: 0 } // Attendance Percentage      
   
    phone:{type:String},
   
});
                                
//  Hash password before saving student
studentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


module.exports = mongoose.model('Student', studentSchema);


/* StudentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
}); */
