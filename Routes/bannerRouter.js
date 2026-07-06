import express from 'express';
import { 
    createBanner, 
    getBanners, 
    getBannerById, 
    updateBanner, 
    deleteBanner 
} from '../Controllers/bannerController.js';
import { handleUpload } from '../Utils/uploadimage.js';

const router = express.Router();

router.post('/create', handleUpload, createBanner);
router.get('/all', getBanners);
router.get('/:id', getBannerById);
router.put('/update/:id', handleUpload, updateBanner);
router.delete('/delete/:id', deleteBanner);

export default router;
