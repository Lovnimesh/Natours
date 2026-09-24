import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxLength: [40, 'A tour name must have less or equal then 40 characters'],
      minLength: [10, 'A tour name must have more or equal then 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'It should have the difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price value'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // this function has the acess of priceDiscount value
        validator: function (val) {
          // here this only points to current document on New Document creation not on when we update
          return val < this.price;
        },
        message: 'Dsicount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A tour must have a description'],
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    // SCHEMA OPTIONS
    // we have to explicitly specify that virtual properties to be included in schema
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// VIRTUAL PROPERTIES

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// we can't use virtual fields in query

// DOCUMENT MIDDLEWARE: (save)
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE

// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  // usecase: add field secret tours and query the tour which is not secret
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  // implementing clock
  console.log(`this query took ${Date.now - this.start} milliseconds`);
  console.log(doc);

  next();
});

// AGGREGATION MIDDLEWARE

// execute the function before and after the aggrgation happens
// we have still the secret tours in aggregation pipeline we have to exclude the secret tour

tourSchema.pre('aggregate', function (next) {
  // this points the current aggregation object
  // we will use this.pipeline() since it has the stages
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
