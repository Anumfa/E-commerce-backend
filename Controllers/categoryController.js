import Category from '../Models/categoriesschema.js';
import { uploadToCloudinary } from '../Utils/uploadimage.js';
import mongoose from 'mongoose';

// Create Category
export const createCategory = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ success: false, message: 'Database is not connected' });
        }

        const { name } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        
        let subcategories = [];
        if (req.body.subcategories) {
            try {
                subcategories = JSON.parse(req.body.subcategories);
            } catch (e) {
                subcategories = Array.isArray(req.body.subcategories) ? req.body.subcategories : [req.body.subcategories];
            }
        }

        // With upload.any(), files are in req.files
        const file = req.files ? req.files[0] : null;

        if (!file) return res.status(400).json({ success: false, message: 'Image is required' });

        const result = await uploadToCloudinary(file, 'categories');
        
        const newCategory = await Category.create({
            name,
            subcategories,
            imageUrl: result.secure_url
        });

        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Category name already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Categories
export const getCategories = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ success: false, message: 'Database is not connected' });
        }
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Category
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        let subcategories = [];
        if (req.body.subcategories) {
            try {
                subcategories = JSON.parse(req.body.subcategories);
            } catch (e) {
                subcategories = Array.isArray(req.body.subcategories) ? req.body.subcategories : [req.body.subcategories];
            }
        }
        
        let updateData = { name, subcategories };

        const file = req.files ? req.files[0] : null;
        if (file) {
            const result = await uploadToCloudinary(file, 'categories');
            updateData.imageUrl = result.secure_url;
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCategory) return res.status(404).json({ success: false, message: 'Category not found' });

        res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
