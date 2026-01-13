import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config';
import { categoryRoutes, scenarioRoutes } from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
].filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all in development
  },
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

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/scenarios', scenarioRoutes);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
