import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import noteRoutes from './routes/noteRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ensure MongoDB is connected
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Middleware Error:', err.message);
    res.status(500).json({
      success: false,
      message: `Database Connection Failed: ${err.message}`,
    });
  }
});

// 💡 Support both `/api/...` and `/...` to prevent Vercel path-stripping bugs
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/notes', noteRoutes);
app.use('/notes', noteRoutes);

app.get('/api', (req, res) => res.json({ message: 'API is running ' }));
app.get('/', (req, res) => res.json({ message: 'API is running ' }));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;