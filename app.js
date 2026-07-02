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

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/banner', bannerRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/order', orderRouter);
app.use('/api/payment', paymentRouter);

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
