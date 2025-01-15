const mongoose = require('mongoose');

// Define the schema for the Result collection
const resultSchema = new mongoose.Schema({
  regNo: String,
  grade: String,
  creditUnit: Number,
  level: Number,
  courseCode: String,
  semester: Number,
  // courseTitle: String,
});

// Create the Result model
const Result = mongoose.model('Result', resultSchema);

module.exports = Result;