import mongoose from 'mongoose';

const normalizeMongoUri = (uri) => {
    if (!uri) return uri;
    let normalized = uri.trim().replace(/^["']|["'];?$/g, '');
    // Trailing slash before query params causes "Invalid namespace" errors
    normalized = normalized.replace(/\/\?/, '?');
    return normalized;
};

const getDbNameFromUri = (uri) => {
    const match = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^/?]+)/);
    return match?.[1] || undefined;
};

const connectDB = async () => {
    const dbUri = normalizeMongoUri(process.env.DATABASE);

    if (!dbUri) {
        throw new Error('DATABASE environment variable is not set');
    }

    try {
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
