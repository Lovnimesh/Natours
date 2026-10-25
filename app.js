import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controller/errorController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('json spaces', 2);

//  GLOBAL MIDDLEWARES

// 1) Set Security HTTP Headers
app.use(helmet());

// 2) Development  Login
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) Limit Request from Same API
const limiter = rateLimit({
  // maxRequest
  max: 100,
  // time
  windowMs: 60 * 60 * 1000,
  // error message
  message: 'Too many requests from this IP, please  try again in an hour',
});

// creating middleware function
app.use('/api', limiter);

// 4) Body Parser, Ready the data from body into req.body
app.use(express.json({ limit: '10kb' }));
// it is a middleware that modify the incoming data into json method, after that req.body will be available

// 5) Data Sanitization

// -> Against NoSQL query Injection
app.use(mongoSanitize());

// -> Against XSS attack( cross-side-scripting)
app.use(xss());

// 6) Serving Static files
app.use(express.static(`${__dirname}/public`));

// to define our own middleware we use 'app.use()' function

// middleware function is going to execute at every kind of request

// 7) Test MiddleWare
// manuplating the req;
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// ROUTES

// to connect the router from the application we are using middlewar and mounting the router
// in middleware this url path is the path where router is going to be mounted

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find the ${req.originalUrl} on this server.`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE

// Express comes with middleware handlers

app.use(globalErrorHandler);

export default app;
