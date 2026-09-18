import Tour from '../models/tourModel.js';

// 2) ROUTE HANDLERS

const getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'fields', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advance Filtering
    // here we add the $operator sign before the comparison keyword

    // {difficulty: 'easy', duration: {gte: 5}}

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // g is used for multipule match and replace, if we dont' use g here it will only replace the first occurence

    const query = Tour.find(JSON.parse(queryStr));

    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // EXECUTE QUERY
    const tours = await query;

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
    res.stauts(404).json({
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

export { getAllTours, getTour, createTour, updateTour, deleteTour };
