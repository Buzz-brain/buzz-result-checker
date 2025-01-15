const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const XLSX = require('xlsx');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

const Result = require('./model/Result');
const Course = require('./model/Course');

const authRoutes = require('./routes/auth');
const faceRoutes = require('./routes/registerFace');
const verifyRoutes = require('./routes/verifyFace');
const preregisterRoutes = require('./routes/preregister');
const resultVerificationRoutes = require('./routes/verifyResult');


const app = express();

app.set('trust proxy', 1); // For secure cookies behind a proxy

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Serve the static files 
app.use(express.static(__dirname + '/public'));

// Serve the models from the /models directory
app.use('/models', express.static(path.join(__dirname, 'models')));

app.set('view engine', 'ejs');

// Serve the ejs file
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/admin', (req, res) => {
  res.render('admin');
});
app.get('/result', (req, res) => {
  res.render('result');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', faceRoutes);
app.use('/api/auth', verifyRoutes);
app.use('/api/auth', preregisterRoutes);
app.use('/api/auth', resultVerificationRoutes);


// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// API endpoint to upload results
app.post('/api/upload-results', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'level' }, { name: 'courseCode' }, { name: 'semester' }]), async (req, res) => {
  try {
    const file = req.files.file[0];
    const level = req.body.level;
    const courseCode = req.body.courseCode;
    const semester = req.body.semester;



    if (!file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    console.log("req.body", req.body)

    // Validate the file data
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    if (!data || data.length === 0) {
      return res.status(400).send({ message: 'Invalid file data' });
    }

    // Validate the level, course code, and semester
    if (!level || !courseCode || !semester) {
      return res.status(400).send({ message: 'Level, course code, and semester are required' });
    }

    

   // Check if records with the same level, course code, and semester already exist
   const existingRecords = await Result.find({ level, courseCode, semester });

   // If existing records are found, update them
   if (existingRecords.length > 0) {
     await Result.updateMany({ level, courseCode, semester }, { $set: { data: data } });
   } else {
     // If no existing records are found, create new ones
     const results = data.map((row) => ({
       regNo: row.regNo,
       grade: row.grade,
       creditUnit: row.creditUnit,
       level,
       courseCode,
       semester,
     }));

     await Result.insertMany(results);
   }


// Return the uploaded data in the result object
    res.send({ message: 'Results uploaded successfully!', data: data });

console.log("Result Uploaded successfully")
} catch (err) {
console.error(err);
res.status(500).send({ message: 'Error uploading results', error: err.message });
}
});


// API endpoint to get courses for a level
app.get('/api/courses/level/:level', async (req, res) => {
  try {
    const level = req.params.level;
    // Assuming you have a Course model defined elsewhere
    const courses = await Course.find({ level });
    res.send(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error retrieving courses' });
  }
});


// API endpoint to create a new course
app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.send({ message: 'Course created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating course' });
  }
});

// API endpoint to get results for a student
app.get('/api/results', async (req, res) => {
  try {
    const regNo = req.query.regNo;
    const level = req.query.level;
    const semester = req.query.semester;

    // Validate the registration number, level, and semester
    if (!regNo || !level || !semester) {
      return res.status(400).send({ message: 'Registration number, level, and semester are required' });
    }

    const results = await Result.find({ regNo, level, semester });

    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error retrieving results', error: err.message });
  }
});




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
