import dns from 'dns';
import './Config/env.js';

// Fix for DNS resolution issues with MongoDB Atlas in Node.js 17+
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

import app from './app.js';
import connectDB from './Config/db.js';

const PORT = process.env.PORT || 9000;

const startServer = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error('Failed to connect to database. Server will not start.');
        process.exit(1);
    }

    if (!process.env.VERCEL) {
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    }
};

startServer();

export default app;
