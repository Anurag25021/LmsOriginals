import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';

// Initialize Express
const app = express();

// Connect to database
await connectDB();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());  // <-- Move here, before routes
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send('API working'));
app.post('/clerk', clerkWebhooks);
app.use('/api/educator', educatorRouter);  // <-- Removed `express.json()` from here

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
