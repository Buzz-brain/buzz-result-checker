const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
    unique: true,
  },
  currentLevel: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  facialData: { 
    type: Array 
  },  // Store facial data for 2FA
  hasFacialData: { 
    type: Boolean, 
    default: false 
  },  // New field to track facial registration
  password: {
    type: String,
    required: true,
  },
  passwordChanged: {
    type: Boolean,
    default: false,
  },
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;



