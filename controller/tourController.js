import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory.js';

// 2) ROUTE HANDLERS

const aliasTopTours = (req, _res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingAverage,difficutly';

  next();
};

const getAllTours = getAll(Tour);

const getTour = getOne(Tour, { path: 'reviews' });

const createTour = createOne(Tour);

const updateTour = updateOne(Tour);

const deleteTour = deleteOne(Tour);

// const deleteTour = catchAsync(async (req, res, next) => {
//   // delete the tour of id related to user

//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with requested id', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: 'none',
//   });
// });

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    //1st stage is-> match (it is just a query)
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },

    {
      $group: {
        // _id: null,
        _id: '$difficulty',
        numRatings: { $sum: '$ratingQuantity' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    // sort stage
    {
      // 1-> ascending
      $sort: { avgPrcie: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

const getMOnthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    // unwind stage is used to 'deconstruct an array field from the inpuct documents and then output one document for each element of the array'
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        // we have mongodb aggregation pipeline operators that we will use below
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        // we use push operator to push the name of tour
        tours: { $push: '$name' },
      },
    },

    // add field stage
    // used to define a new field
    {
      // {name_of_field: value}
      $addFields: { month: '$_id' },
    },

    // project stage is used to hide or show the field, 0->hide and 1->show
    // field_name : 0 or 1
    {
      $project: {
        _id: 0,
      },
    },

    {
      $sort: { numTourStarts: -1 },
    },

    // limit stage works same as in query
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

export {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMOnthlyPlan,
};
