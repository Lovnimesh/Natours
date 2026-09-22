import mongoose from 'mongoose';

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
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
  },
  {
    // SCHEMA OPTIONS
    // we have to explicitly specify that virtual properties to be included in schema
    toJSON: { virtual: true },
  },
);

// VIRTUAL PROPERTIES
// we have to attach get method, because the virtual property will be created each time when we get some data out of the database
tourSchema.virtual('durationWeeks').get(function () {
  // here we dont define the arrow function
  // arrow function doesn't get it's this keyword thats why we use normal function
  // here this keyword is going to point current document
  return this.duration / 7;
});

// we can't use virtual fields in query

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
