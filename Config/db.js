import mongoose from 'mongoose';
import dns from 'dns';

// Use Google DNS for more reliable MongoDB Atlas resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const normalizeMongoUri = (uri) => {
    if (!uri) return uri;
    let normalized = uri.trim().replace(/^["']|["'];?$/g, '');
    
    // Fix spaces in the database name part of the URI
    // E.g. "mongodb://.../project ecommerce?..." -> "mongodb://.../project_ecommerce?..."
    normalized = normalized.replace(/\/([^/?\s]+(?:\s|%20)[^/?]+)(\?|$)/, (match, p1, p2) => {
        return '/' + p1.replace(/%20|\s/g, '_') + p2;
    });

    // Trailing slash before query params causes "Invalid namespace" errors
    normalized = normalized.replace(/\/\?/, '?');
    return normalized;
};

const getDbNameFromUri = (uri) => {
    const match = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^/?]+)/);
    // Remove spaces or replace with underscores in case of typos in Env Vars
    let dbName = match?.[1] || undefined;
    if (dbName) {
        dbName = dbName.replace(/%20|\s/g, '_');
    }
    return dbName;
};

const connectDB = async () => {
    const dbUri = normalizeMongoUri(process.env.DATABASE);

    if (!dbUri) {
        throw new Error('DATABASE environment variable is not set');
    }

    try {
        if (mongoose.connection.readyState >= 1) {
            console.log('MongoDB already connected.');
            return mongoose.connection;
        }
        
        console.log('Connecting to MongoDB...');
        const dbName = getDbNameFromUri(dbUri);
        const conn = await mongoose.connect(dbUri, {
            family: 4,
            ...(dbName ? { dbName } : {})
        });
        console.log(`MongoDB Connected: ${conn.connection.host} (db: ${conn.connection.name})`);
        return conn;
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        throw error;
    }
};

export default connectDB;
