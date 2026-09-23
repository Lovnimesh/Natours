import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
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
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price value'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      // trim is special type of option that is only works for string type attribute, it removes all the wide space
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A tour must have a description'],
      trim: true,
    },
    imageCover: {
      type: String,
      require: [true, 'A tour must have a cover image'],
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
  ``;
});

tourSchema.post(/^find/, function (doc, next) {
  // implementing clock
  console.log(`this query took ${Date.now - this.start} milliseconds`);
  console.log(doc);

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
