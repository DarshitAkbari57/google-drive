const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(cors({ 
  origin: ['http://localhost:3000', 'https://google-drive-mjmy.vercel.app'], 
  credentials: true 
}));

app.use(express.json());

app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  next();
});

app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    const extname = path.split('.').pop();
    if (extname === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
    } else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extname)) {
      res.setHeader('Content-Type', 'image/' + extname);
    } else if (extname === 'txt') {
      res.setHeader('Content-Type', 'text/plain');
    } else {
      res.setHeader('Content-Type', 'application/octet-stream');
    }
    res.setHeader('Content-Disposition', 'inline');  // Ensure inline display, not download
  },
}));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

startServer();
