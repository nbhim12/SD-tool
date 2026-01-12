import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'IGBC Tool API is running',
    timestamp: new Date().toISOString()
  });
});

// TODO: Add routes in PR 3
// app.use('/api/categories', categoryRoutes);
// app.use('/api/scenarios', scenarioRoutes);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    app.listen(PORT, () => {
      console.log( Server running on http://localhost:\);
      console.log( Health check: http://localhost:\/api/health);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
