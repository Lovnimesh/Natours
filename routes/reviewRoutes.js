import express from 'express';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setTourAndUserIds,
  updateReview,
} from '../controller/reviewController.js';
import { protect, restrictTo } from '../controller/authController.js';

const router = express.Router({ mergeParams: true });

// we are passing the opiton {mergeParams : true} in the Router() method, such that we can get the access of params defined in mounted route (tourId)

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// POST /reviews

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourAndUserIds, createReview);

router
  .route('/:id')
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .get(getReview);

export default router;
