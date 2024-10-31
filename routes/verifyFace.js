const express = require('express');
const Student = require('../models/Student');
const faceapi = require('face-api.js'); 
const router = express.Router();
const FaceMatcher = faceapi.FaceMatcher;  // Import with correct capitalization

router.post('/verify-face-for-result', async (req, res) => {
  try {
    const { facialData } = req.body;
    const regNo = req.session.regNo; 

    if (!facialData || !regNo) {
      return res.status(400).json({ message: 'Facial data or registration number is missing.' });
    }

    const student = await Student.findOne({ regNo });
    if (!student || !student.facialData) {
      return res.status(404).json({ message: 'Student not found or no facial data available.' });
    }

    // Extract the data from student.facialData[0] into an array and
    // Convert the array of values into a Float32Array
    const storedDescriptor = new Float32Array(Object.values(student.facialData[0]));
    const capturedDescriptor = new Float32Array(Object.values(facialData));

    // console.log("Stored Descriptor:", storedDescriptor, storedDescriptor.length);
    // console.log("Captured Descriptor:", capturedDescriptor, capturedDescriptor.length);

     // Create labeled descriptor for comparison
     const storedLabeledDescriptor = new faceapi.LabeledFaceDescriptors(student.regNo, [storedDescriptor]);

     // Face matcher with reduced threshold
     const matcher = new FaceMatcher([storedLabeledDescriptor], 0.35);
 
     const bestMatch = matcher.findBestMatch(capturedDescriptor);

    console.log('Best match:', bestMatch);
    console.log('Stored regNo:', student.regNo);
    console.log('Best match label:', bestMatch.label);
    console.log('Best match distance:', bestMatch.distance);

    // Check if the match is valid
    if (bestMatch.label === student.regNo && bestMatch.distance <= 0.35) {  // Stricter threshold
      const result = req.session.result;
      return res.status(200).json({ message: 'Facial recognition successful. Access granted.', result });
    } else {
      return res.status(401).json({ message: 'Facial recognition failed.' });
    }
  } catch (error) {
    console.error('Error during face verification:', error);
    return res.status(500).json({ message: 'An error occurred during face verification.' });
  }
});

module.exports = router;
