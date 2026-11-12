import express from 'express';

import {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  aliasTopTours,
  getTourStats,
  getMOnthlyPlan,
  getToursWithIn,
  getDistances,
} from '../controller/tourController.js';
import { protect, restrictTo } from '../controller/authController.js';
import reviewRouter from './reviewRoutes.js';

const router = express.Router();

// router.param('id', checkID);
// review endpoints

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews

// we are mounting the router here
router.use('/:tourId/reviews', reviewRouter);

// route alias for top tours
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMOnthlyPlan);

router.route('/tour-stats').get(getTourStats);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithIn);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

// if id is not valid then it will return from here no need to verfiy in all the request handler
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

export default router;
