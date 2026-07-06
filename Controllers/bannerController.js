import Banner from '../Models/bannerschema.js';
import { uploadToCloudinary } from '../Utils/uploadimage.js';
import mongoose from 'mongoose';

// Create Banner
export const createBanner = async (req, res) => {
    try {


        const { title, description } = req.body;

        if (!title?.trim() || !description?.trim()) {
            return res.status(400).json({ success: false, message: 'Title and description are required' });
        }
        // With upload.any(), files are in req.files
        const file = req.files ? req.files[0] : null;

        if (!file) return res.status(400).json({ success: false, message: 'Image is required' });

        const result = await uploadToCloudinary(file, 'banners');

        const newBanner = await Banner.create({
            title,
            description,
            imageUrl: result.secure_url
        });

        res.status(201).json({ success: true, data: newBanner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Banners
export const getBanners = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log("Database connection is not ready. Serving dynamic mock banners...");
            return res.status(200).json({ success: true, data: [] });
        }
        const banners = await Banner.find();
        res.status(200).json({ success: true, data: banners });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Banner
export const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
        res.status(200).json({ success: true, data: banner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Banner
export const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        let updateData = { title, description };

        const file = req.files ? req.files[0] : null;
        if (file) {
            const result = await uploadToCloudinary(file, 'banners');
            updateData.imageUrl = result.secure_url;
        }

        const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBanner) return res.status(404).json({ success: false, message: 'Banner not found' });

        res.status(200).json({ success: true, data: updatedBanner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Banner
export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findByIdAndDelete(id);
        if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

        res.status(200).json({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
