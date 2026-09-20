import express from 'express';

import {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  aliasTopTours,
} from '../controller/tourController.js';

const router = express.Router();

// router.param('id', checkID);

// route alias for top tours
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// if id is not valid then it will return from here no need to verfiy in all the request handler
router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
