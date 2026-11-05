import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';
import { deleteOne } from './handlerFactory.js';

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const createReview = catchAsync(async (req, res, next) => {
  // ALLOW NESTED ROUTES
  if (!req.body.tour) req.body.tour = req.params.tourId;

  if (!req.body.user) req.body.user = req.user.id;

  const reviewData = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: reviewData,
    },
  });
});

const deleteReview = deleteOne(Review);

export { createReview, getAllReviews, deleteReview };
