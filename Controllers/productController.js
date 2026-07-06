import Product from '../Models/productschema.js';
import { uploadToCloudinary } from '../Utils/uploadimage.js';
import mongoose from 'mongoose';

// Create Product
export const createProduct = async (req, res) => {
    try {


        let { name, description, quantity, size, color, ptype, price, discount, discountprice, catid } = req.body;
        
        // Handle discount percentage (e.g., "10%" -> 10)
        if (typeof discount === 'string' && discount.includes('%')) {
            discount = parseFloat(discount.replace('%', ''));
        }

        if (!catid || !mongoose.Types.ObjectId.isValid(catid)) {
            return res.status(400).json({ success: false, message: 'Valid category is required' });
        }

        // Check if files are present
        if (!req.files || req.files.length < 1) {
            return res.status(400).json({ success: false, message: 'At least 1 image is required for a new product' });
        }

        // Upload images to Cloudinary
        const uploadPromises = req.files.map(file => uploadToCloudinary(file, 'products'));
        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map(result => result.secure_url);

        // Parse arrays robustly (handles JSON strings, comma-separated strings, or single values)
        const parseArrayField = (field) => {
            if (!field) return [];
            if (Array.isArray(field)) return field;
            try {
                const parsed = JSON.parse(field);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                return field.split(',').map(item => item.trim()).filter(item => item !== "");
            }
        };

        const parsedSize = parseArrayField(size);
        const parsedColor = parseArrayField(color);

        const newProduct = await Product.create({
            name,
            description,
            quantity: Number(quantity),
            size: parsedSize,
            color: parsedColor,
            ptype,
            price: Number(price),
            discount: discount ? Number(discount) : 0,
            discountprice: discountprice ? Number(discountprice) : 0,
            images: imageUrls,
            catid
        });

        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Products
export const getProducts = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log("Database connection is not ready. Serving dynamic mock products...");
            return res.status(200).json({ success: true, data: [] });
        }
        const products = await Product.find().populate('catid');
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Product
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('catid');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let { name, description, quantity, size, color, ptype, price, discount, discountprice, catid } = req.body;

        // Handle discount percentage (e.g., "10%" -> 10)
        if (typeof discount === 'string' && discount.includes('%')) {
            discount = parseFloat(discount.replace('%', ''));
        }

        let updateData = { 
            name, 
            description, 
            quantity, 
            ptype, 
            price, 
            discount, 
            discountprice, 
            catid 
        };

        // Parse arrays robustly (handles JSON strings, comma-separated strings, or single values)
        const parseArrayField = (field) => {
            if (!field) return [];
            if (Array.isArray(field)) return field;
            try {
                const parsed = JSON.parse(field);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                return field.split(',').map(item => item.trim()).filter(item => item !== "");
            }
        };

        // Handle Size and Color arrays
        if (size) updateData.size = parseArrayField(size);
        if (color) updateData.color = parseArrayField(color);

        // If new images are uploaded
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => uploadToCloudinary(file, 'products'));
            const uploadResults = await Promise.all(uploadPromises);
            updateData.images = uploadResults.map(result => result.secure_url);
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedProduct) return res.status(404).json({ success: false, message: 'Product not found' });

        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
