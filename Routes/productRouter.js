import express from 'express';
import { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from '../Controllers/productController.js';
import { handleUpload } from '../Utils/uploadimage.js';

const router = express.Router();

router.post('/create', handleUpload, createProduct);
router.get('/all', getProducts);
router.get('/:id', getProductById);
router.put('/update/:id', handleUpload, updateProduct);
router.delete('/delete/:id', deleteProduct);

export default router;
