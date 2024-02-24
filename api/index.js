import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB = process.env.MONGODBS;

mongoose.connect(DB).then(
    () => { console.log('MongoDB is Connected'); 
}).catch(err => {console.log(err);
});

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);