const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

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


// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the admin.html file
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
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


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
