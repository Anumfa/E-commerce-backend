import express from 'express';
import { 
    createCategory, 
    getCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} from '../Controllers/categoryController.js';
import { handleUpload } from '../Utils/uploadimage.js';

const router = express.Router();

router.post('/create', handleUpload, createCategory);
router.get('/all', getCategories);
router.get('/:id', getCategoryById);
router.put('/update/:id', handleUpload, updateCategory);
router.delete('/delete/:id', deleteCategory);

export default router;
