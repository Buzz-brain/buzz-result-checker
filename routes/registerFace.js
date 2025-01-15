const express = require('express');
const Student = require('../model/Student');
const router = express.Router();

// Register Facial Data Route
router.post('/register-face', async (req, res) => {
  const { regNo, facialData } = req.body;

  // Basic input validation
  if (!regNo || !facialData) {
    return res.status(400).json({ message: 'Registration number and facial data are required.' });
  }

  try {
    const student = await Student.findOne({ regNo });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Convert Float32Array to normal array for storage and update student record
    student.facialData = facialData;
    student.hasFacialData = true;  // Set the flag to true
    await student.save();

    res.status(200).json({ message: 'Facial data registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while registering facial data.' });
  }
});

module.exports = router;
