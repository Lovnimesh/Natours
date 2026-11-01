import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const reviewData = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: reviewData,
    },
  });
});

export { createReview, getAllReviews };
