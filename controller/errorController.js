import AppError from '../utils/appError.js';

// response sender for development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

// response sender for production
const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    // 1) log error
    console.error('ERROR', err);

    // 2) SEND generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

// Invalid ID error transformer
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);

  // we are returning AppError object to mark it as operational error
};

// Duplicate Key Error transformer
const handleDuplicateFieldErrorDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}`;
  return new AppError(message, 400);
};

// validation error transformer
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('.\n')}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, Please login Again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, Please login again', 401);

export default (err, req, res, next) => {
  // console.log(err.stack);
  // err.stack reveals the error location

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // its not a good practice to change the args object so  we created the hard copy
    let error = { ...err, name: err.name };
    console.log(error);

    // here we are transforming the mongoose error into a error with statuscode and message
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // Handling duplicate key error
    if (error.code === 11000) error = handleDuplicateFieldErrorDB(error);

    //Handling validation error
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

    // handling authanticaiton failed error
    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    // handling JWT expired token error
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
