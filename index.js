const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');

dotenv.config();

const authRoutes = require('./routes/auth');
const faceRoutes = require('./routes/registerFace');
const verifyRoutes = require('./routes/verifyFace');
const preregisterRoutes = require('./routes/preRegister');
const resultVerificationRoutes = require('./routes/verifyResult');


const app = express();

// Use express-session middleware
app.use(session({
  secret: 'your-secret-key', // Change this to a random string
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // Session expiration time (1 day)
  }
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Serve the static files 
app.use(express.static(__dirname + '/public'));

// Serve the models from the /models directory
app.use('/models', express.static(path.join(__dirname, 'models')));


// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('https://result-checker-eta.vercel.app/api/auth', authRoutes);
app.use('https://result-checker-eta.vercel.app/api/auth', faceRoutes);
app.use('https://result-checker-eta.vercel.app/api/auth', verifyRoutes);
app.use('https://result-checker-eta.vercel.app/api/auth', preregisterRoutes);
app.use('https://result-checker-eta.vercel.app/api/auth', resultVerificationRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
