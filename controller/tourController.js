import Tour from '../models/tourModel.js';

// 2) ROUTE HANDLERS

const getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // 1st WAY
    const toursData = await Tour.find({});

    // 2nd WAY

    res.status(200).json({
      status: 'successfull',
      results: toursData.length,
      data: {
        tours: toursData,
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
