import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
// 2) ROUTE HANDLERS

const aliasTopTours = (req, _res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,pric e,ratingAverage,difficutly';

  next();
};

const getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    // Here we are able to chain it, because we are returning the object in each method
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'successfull',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const getTour = async (req, res) => {
  try {
    // mongoose provid us the easiest way to search a document by ID using function "findById()"
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  try {
    // const newTour = new Tour(req.body);
    // newTour.save();

    // we can create and save new Tour data using 'create' method, i.e. present in Tour model

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  // update the property of tour of id related to user
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      stauts: 'failed',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  // delete the tour of id related to user

  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: 'none',
    });
  } catch (err) {
    res.status(404).json({
      stauts: 'failed',
      message: err,
    });
  }
};

const getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const getMOnthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

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
