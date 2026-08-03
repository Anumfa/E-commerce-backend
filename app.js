import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import bannerRouter from './Routes/bannerRouter.js';
import categoryRouter from './Routes/categoryRouter.js';
import productRouter from './Routes/productRouter.js';
import authRouter from './Routes/authRouter.js';
import cartRouter from './Routes/cartRouter.js';
import wishlistRouter from './Routes/wishlistRouter.js';
import orderRouter from './Routes/orderRouter.js';
import paymentRouter from './Routes/paymentRouter.js';
import dashboardRouter from './Routes/dashboardRouter.js';
import reviewRouter from './Routes/reviewRouter.js';
import contactRouter from './Routes/contactRouter.js';

import connectDB from './Config/db.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Ensure database is connected for every request in serverless environments
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection failed in middleware:', error.message);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

// Routes
app.use('/api/banner', bannerRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/order', orderRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/review', reviewRouter);
app.use('/api/contact', contactRouter);

// Default Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Handle Multer errors
    if (err.name === 'MulterError') {
        return res.status(400).json({ success: false, message: err.message });
    }
    
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
    });
});

export default app;
