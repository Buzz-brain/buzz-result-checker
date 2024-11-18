// routes/preregister.js
const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
// const adminMiddleware = require('../middleware/authAdmin');
const router = express.Router();

// Preregister a student
router.post('/preregister', async (req, res) => {
  try {
    const { regNo, password } = req.body;

    // Check if the student already exists
    const existingStudent = await Student.findOne({ regNo });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already registered.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new student document
    const newStudent = new Student({
      regNo,
      password: hashedPassword,
      passwordChanged: false, // Mark as false since they haven't changed it yet
    });

    await newStudent.save();

    res.status(201).json({ message: 'Student preregistered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
