const mongoose = require('mongoose');

// Define the Result schema
const resultSchema = new mongoose.Schema({
  regNo: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  grades: [{
    courseCode: String,
    grade: String
  }]
});

// Create and export the Result model
const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
