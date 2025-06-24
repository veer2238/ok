import express from "express";
const app = express();

import mongoose from "mongoose";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import Registerb from './Routes/Register.js';
import Loginb from './Routes/Login.js';
import Workb from './Routes/Work.js';
import Learning from './Routes/Api.js';
// import CertificateRoute from './Routes/Certificate.js';
import CertificateRoute from './Routes/Certificate.js';
import Survey from './Routes/survey.js';
import studentRoutes from './Routes/student.js';
import uploadRoutes from './Routes/upload.js'; // ✅ Google Review Screenshot Upload

// const CertificateRoute = require('./Routes/Certificate.js');

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb+srv://veer04agraval:mRU37WQcT8udQc7n@cluster0.lnugf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Route mounting
app.use('/', Registerb);
app.use('/', Learning);
app.use('/', Loginb);
app.use('/', Workb);
app.use('/api', CertificateRoute);
app.use('/', Survey);
app.use('/api', studentRoutes);
app.use('/api', uploadRoutes); // ✅ Mount upload route

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/reports', express.static(path.join(__dirname, 'public/reports')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ✅ Serve uploaded screenshots

// Start server
app.listen(5009, () => console.log('✅ Server running on http://localhost:5009'));
