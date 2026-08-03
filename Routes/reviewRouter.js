import express from 'express';
import {
    createReview,
    getAllReviews,
    getApprovedReviews,
    approveReview,
    declineReview,
    deleteReview
} from '../Controllers/reviewController.js';

const router = express.Router();

router.post('/create', createReview);
router.get('/all', getAllReviews);
router.get('/approved', getApprovedReviews);
router.put('/approve/:id', approveReview);
router.put('/decline/:id', declineReview);
router.delete('/delete/:id', deleteReview);

export default router;
