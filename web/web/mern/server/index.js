const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json()); // ✅ Add this line
app.use(express.urlencoded({ extended: true }));


// Debug environment variables
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file. Exiting...');
  process.exit(1);
}

if (!process.env.MONGODB_URI.includes('mongodb+srv')) {
  console.error('Error: MONGODB_URI must be a MongoDB Atlas connection string (mongodb+srv://...). Exiting...');
  process.exit(1);
}

// MongoDB connection with retry logic
const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10, // Connection pooling
      });
      console.log('Connected to MongoDB Atlas');
      mongoose.connection.db.admin().listDatabases((err, result) => {
        if (err) {
          console.error('Error listing databases:', err);
        } else {
          console.log('Available databases:', result.databases.map(db => db.name));
        }
      });
      break;
    } catch (err) {
      console.error('MongoDB connection error:', err);
      retries -= 1;
      if (retries === 0) {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
      console.log(`Retrying connection (${retries} attempts left)...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Disconnect any existing connections and connect
mongoose.disconnect().then(() => {
  console.log('Disconnected from any existing MongoDB connections');
  connectDB();
}).catch(err => {
  console.error('Error disconnecting existing connections:', err);
  connectDB();
});

// Routes
let authRouter, appointmentRouter, doctorRouter, dentalHistoryRouter;
try {
  authRouter = require('./Routers/authRouter');
  appointmentRouter = require('./Routers/appointmentRouter');
  doctorRouter = require('./Routers/doctorRouter');
  dentalHistoryRouter = require('./Routers/dentalHistoryRouter');
  console.log('Loaded routers from ./Routers/');
} catch (e) {
  console.error('Error: Cannot find routers in ./Routers/. Exiting...', e);
  process.exit(1);
}

app.use('/api/auth', authRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/dental-history', dentalHistoryRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});