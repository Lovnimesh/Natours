import express from 'express';
import { createReview, getAllReviews } from '../controller/reviewController.js';
import { protect, restrictTo } from '../controller/authController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictTo('user', 'guide'), createReview);

export default router;
