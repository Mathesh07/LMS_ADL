import express from "express"
import cors from "cors"
import morgan from "morgan";

import authRoutes from './routes/authRoutes.js';
import {connectDB} from './db/connect.js';

const app = express();
const PORT = 8000;


app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  connectDB();
});


