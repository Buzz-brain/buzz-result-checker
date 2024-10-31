const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { regNo, password } = req.body;

  const student = await Student.findOne({ regNo });
  if (!student) return res.status(401).json({ message: 'Invalid registration number' });

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

  if (!student.passwordChanged) {
    return res.status(200).json({ message: 'First-time login, please change your password', firstLogin: true });
  }

  if (!student.hasFacialData) {
    return res.status(200).json({ message: 'Please register your facial data.', proceedToFaceRegistration: true });
  }

  // Redirect to result checker page after successful login
  res.status(200).json({ message: 'Login successful. Redirecting to result checker.', redirectToResultChecker: true });
});

// Change Password Route
router.post('/change-password', async (req, res) => {
  const { regNo, newPassword } = req.body;

  // Find the student by registration number
  const student = await Student.findOne({ regNo });
  if (!student) return res.status(404).json({ message: 'Student not found' });

  // Hash the new password before saving it
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  student.password = hashedPassword;  // Save the hashed password
  student.passwordChanged = true;  // Mark password as changed
  await student.save();

  res.status(200).json({ message: 'Password changed successfully. Please register your facial data.' });
});

module.exports = router;
