import express from 'express';
import {
  createReview,
  deleteReview,
  getAllReviews,
} from '../controller/reviewController.js';
import { protect, restrictTo } from '../controller/authController.js';

const router = express.Router({ mergeParams: true });

// we are passing the opiton {mergeParams : true} in the Router() method, such that we can get the access of params defined in mounted route (tourId)

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// POST /reviews

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictTo('user', 'guide'), createReview);

router.route('/:id').delete(deleteReview);

export default router;
