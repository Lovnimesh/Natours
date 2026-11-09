import mongoose from 'mongoose';
import Tour from './tourModel.js';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can't be empty"],
    },
    rating: {
      type: Number,
      min: [1, 'Rating cant be below 1'],
      max: [5, 'rating cant be above 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // parent refrencing
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  //   virtual properties are fields that is present at document but not stored in database
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// pouplating the refrenced document
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    // select all the reviews that belongs to the passed tour
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        // grouping the data based on tour
        _id: `$tour`,
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });

  console.log(stats);
};

reviewSchema.post('save', function () {
  // this points to current review

  this.constructor.calculateAverageRatings(this.tour);
});

// findByIdAndUpdate -> findOneAndUpdate
// findByIdAndDelete -> findOneAndDelete

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this points to current query so we await/execute the query to get the document
  // we can only execute the query in pre type in post type query will already be executed
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); Doesn't work here, query has already executed
  this.r.constructor.calculateAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
