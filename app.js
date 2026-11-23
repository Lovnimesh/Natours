import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controller/errorController.js';
import reviewRouter from './routes/reviewRoutes.js';
import viewRouter from './routes/viewRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('json spaces', 2);

// defining the view engine
app.set('view engine', 'pug');
// defining the where the templates are located
app.set('views', path.join(__dirname, 'views'));

//  GLOBAL MIDDLEWARES
// 1) Serving Static files
app.use(express.static(path.join(__dirname, 'public')));

// 1) Set Security HTTP Headers
// app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: [
        "'self'",
        'https://api.mapbox.com',
        'blob:',
        'https://cdnjs.cloudflare.com',
      ],
      styleSrc: [
        "'self'",
        'https://api.mapbox.com',
        'https://fonts.googleapis.com',
        "'unsafe-inline'",
      ],
      workerSrc: ["'self'", 'blob:'],
      childSrc: ['blob:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: [
        "'self'",
        'https://api.mapbox.com',
        'https://events.mapbox.com',
        'https://*.tiles.mapbox.com',
      ],
    },
  }),
);

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
app.use(cookieParser());
// it is a middleware that modify the incoming data into json method, after that req.body will be available

// 5) Data Sanitization

// -> Against NoSQL query Injection
app.use(mongoSanitize());

// -> Against XSS attack( cross-side-scripting)
app.use(xss());

// 6) Prevent Parameter pollution,

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// to define our own middleware we use 'app.use()' function

// middleware function is going to execute at every kind of request

// 8) Test MiddleWare
// manuplating the req;
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// 9
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
