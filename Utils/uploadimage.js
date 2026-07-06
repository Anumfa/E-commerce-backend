import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const ensureCloudinaryConfig = () => {
    if (!process.env.Cloudname || !process.env.Cloudkey || !process.env.Cloudsecret) {
        throw new Error('Cloudinary credentials are missing in environment variables');
    }

    cloudinary.config({
        cloud_name: process.env.Cloudname,
        api_key: process.env.Cloudkey,
        api_secret: process.env.Cloudsecret
    });
};

// Multer Storage (Memory)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const handleUpload = (req, res, next) => {
    upload.any()(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

// Helper function to upload to Cloudinary
const uploadToCloudinary = (file, folder) => {
    ensureCloudinaryConfig();

    const buffer = file?.buffer || file;
    const mimetype = file?.mimetype || 'image/jpeg';

    if (!buffer?.length) {
        return Promise.reject(new Error('Invalid file buffer'));
    }

    const dataUri = `data:${mimetype};base64,${buffer.toString('base64')}`;

    return cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: 'auto',
        timeout: 60000
    });
};

export { upload, handleUpload, uploadToCloudinary, cloudinary };
