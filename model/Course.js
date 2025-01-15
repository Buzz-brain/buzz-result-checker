const mongoose = require('mongoose');

// Define the schema for the Course collection
const courseSchema = new mongoose.Schema({
  code: String,
  title: String,
  level: Number,
  semester: Number,
  creditUnit: Number
});

// Create the Course model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;