import express from 'express';
import morgan from 'morgan';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('json spaces', 2);

// 1 MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// it is a middleware that modify the incoming data into json method, after that req.body will be available

app.use(express.static(`${__dirname}/public`));

// to define our own middleware we use 'app.use()' function

// middleware function is going to execute at every kind of request

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

// .all() method handles the request coming from any http method
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find the ${req.originalUrl} on this server.`,
  });
});

// GLOBAL ERROR HANDLING MIDDLEWARE

// Express comes with middleware handlers

app.use((err, req, res, next) => {
  // by specifying the 4 args above, express recognizes it as a error handling middleware

  // defining the statusCode and stuatus for error object when it is undefined
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
