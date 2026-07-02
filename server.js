import dotenv from 'dotenv';
import dns from 'dns';

// Load env vars at the very beginning
dotenv.config();

// Fix for DNS resolution issues with MongoDB Atlas in Node.js 17+
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

// Add fallback DNS to prevent ECONNREFUSED during SRV lookup
// try {
//     dns.setServers(['8.8.8.8', '8.8.4.4']);
// } catch (err) {
//     console.error('Failed to set DNS servers:', err);
// }

import app from './app.js';
import connectDB from './Config/db.js';

// Connect to Database
connectDB();

const PORT = process.env.PORT || 9000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

export default app;

