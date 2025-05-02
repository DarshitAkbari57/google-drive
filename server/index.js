const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cors({ origin: 'https://google-drive-mjmy.vercel.app', credentials: true }));

app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.setHeader('Content-Type', 'application/octet-stream');  // Or a specific content type based on file type
    res.setHeader('Content-Disposition', 'inline');  // Display in browser, not download
  },
}));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    app.listen(5000, () => {
      console.log('🚀 Server running on port 5000');
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

startServer();
