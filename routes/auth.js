const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../model/Student');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { regNo, password } = req.body;

  // Find student by registration number
  const student = await Student.findOne({ regNo });
  if (!student) {
    return res.status(401).json({ message: 'Invalid registration number' });
  }

  // Check if the password matches
  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Store student information in session
  req.session.regNo = regNo; // Store regNo in session
  req.session.studentId = student._id; // Store student ID for later use


  // Case 1: If it's the first login, ask the user to change their password
  if (!student.passwordChanged) {
    return res.status(200).json({ message: 'First-time login, please change your password', firstLogin: true });
  }

  // Case 2: If the password is changed but facial recognition is not done
  if (!student.hasFacialData) {
    return res.status(200).json({ message: 'Please register your facial data.', proceedToFaceRegistration: true });
  }

  // Case 3: If both password is changed and facial data is registered, redirect to result checker
  res.status(200).json({ message: `Login successful. Redirecting to result checker. ${req.session.regNo}`, redirectToResultChecker: true });
});

// Change Password Route
router.post('/change-password', async (req, res) => {
  const { regNo, newPassword } = req.body;

  // Find the student by registration number
  const student = await Student.findOne({ regNo });
  if (!student) return res.status(404).json({ message: 'Student not found' });

  // Hash the new password before saving it
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update student record
  student.password = hashedPassword;
  student.passwordChanged = true; // Mark that the password has been changed
  await student.save();

  res.status(200).json({ message: 'Password changed successfully. Please register your facial data.' });
});

module.exports = router;
