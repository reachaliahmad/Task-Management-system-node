require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
connectDB();

app.use(cors({
  origin: 'https://task-management-system-vite-cvw14fk3q.vercel.app',
  credentials: true
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
