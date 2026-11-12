import Tour from '../models/tourModel.js';
import AppError from '../utils/appError.js';
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

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-distance/233/center/34.111745, -118.113491/unit/mi
const getToursWithIn = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // converting the distance to radians unit, because mongoose expect radius data in radians = dist/radius
  const radius =
    unit === 'mi' ? Number(distance) / 3963.2 : Number(distance) / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'please provide latitude  and longitude in the format lat,lng',
        400,
      ),
    );
  }

  // geoSpatial query
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  // console.log(distance, lat, lng, unit);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    next(
      new AppError(
        'please provide latitude  and longitude in the format lat,lng',
        400,
      ),
    );
  }

  const multipler = unit === 'mi' ? 0.00062137 : 0.001;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multipler,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
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
  getToursWithIn,
  getDistances,
};
