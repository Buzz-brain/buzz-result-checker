// // routes/resultVerification.js
// const express = require('express');
// const router = express.Router();
// const Result = require('../models/Result');
// const Student = require('../models/Student');

// // Route to handle result verification and access
// router.post('/verify-result', async (req, res) => {
//   const { regNo, semester, level } = req.body;

//   try {
//     // Find the student record
//     const student = await Student.findOne({ regNo });
//     if (!student) return res.status(404).json({ message: 'Student not found' });

//     // Find the result based on the provided semester and level
//     const result = await Result.findOne({ regNo, semester, level });
//     if (!result) return res.status(404).json({ message: 'No result found for the specified semester and level' });

//     // If result is found, return it to the client
//     res.status(200).json({ result });
//   } catch (err) {
//     res.status(500).json({ message: 'An error occurred while verifying the result', error: err.message });
//   }
// });

// module.exports = router;


// routes/resultVerification.js
const express = require('express');
const router = express.Router();

// Temporary data to simulate student results
const mockResults = [
  {
    regNo: '20191100001',
    semester: 'First Semester',
    level: '100',
    result: {
      courses: [
        { courseCode: 'MTH101', grade: 'A' },
        { courseCode: 'PHY101', grade: 'B' },
        { courseCode: 'CHM101', grade: 'C' },
      ],
      GPA: 4.5
    }
  },
  {
    regNo: '20191100002',
    semester: 'First Semester',
    level: '100',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'B' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 4.8
    }
  },
  {
    regNo: '20191100003',
    semester: 'First Semester',
    level: '100',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  {
    regNo: '20191100004',
    semester: 'First Semester',
    level: '100',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  {
    regNo: '20191100005',
    semester: 'First Semester',
    level: '100',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  {
    regNo: '20191100006',
    semester: 'First Semester',
    level: '100',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  {
    regNo: '20191100007',
    semester: 'First Semester',
    level: '100',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  {
    regNo: '20191100008',
    semester: 'First Semester',
    level: '100',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  {
    regNo: '20191100009',
    semester: 'First Semester',
    level: '100',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  ,
  {
    regNo: '20191161772',
    semester: 'First Semester',
    level: '100',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  {
    regNo: '20191161772',
    semester: 'First Semester',
    level: '200',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  {
    regNo: '20191161772',
    semester: 'First Semester',
    level: '300',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  {
    regNo: '20191161772',
    semester: 'First Semester',
    level: '400',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  },
  {
    regNo: '20191161772',
    semester: 'First Semester',
    level: '500',
    result: {
      courses: [
        { courseCode: 'CSC201', grade: 'A' },
        { courseCode: 'PHY201', grade: 'A' },
        { courseCode: 'MTH201', grade: 'A' },
      ],
      GPA: 5.0
    }
  }
];

// Route to handle result verification and access
router.post('/verifyResult', (req, res) => {
  const { semester, level } = req.body;

  const regNo = req.session.regNo; // Get regNo from session

  console.log(semester, level, regNo)
  // Find the result based on the provided regNo, semester, and level
  const studentResult = mockResults.find(result => 
    result.regNo === regNo &&
    result.semester === semester &&
    result.level === level
  );

  // If no result found, return error message
  if (!studentResult) {
    return res.status(404).json({ message: 'No result found for the specified semester and level' });
  }

  // Store result in session for later access after face verification
  req.session.result = studentResult.result;

  // If result is found, return it to the client
  res.status(200).json({ message: 'Proceed to face verification', result: studentResult.result });
});

module.exports = router;
