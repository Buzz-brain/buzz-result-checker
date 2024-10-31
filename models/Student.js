const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },  // Registration number
  password: { type: String, required: true },  // Temporary password
  facialData: { type: Array },  // Store facial data for 2FA
  passwordChanged: { type: Boolean, default: false }, // To track if they changed password
  hasFacialData: { type: Boolean, default: false },  // New field to track facial registration
  result: { type: Object, default: {} }  // Assuming result is an object
});


const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
