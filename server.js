import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './config.env' });
import app from './app.js';

// for uncaught exceptionn we will will promise the uncaught exception event
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);

  console.log('UNCAUGHT REJECTION! Shutting down....');
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connection successfull');
  });

// to read the env varaible we have to read config the config.env

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// unhandled Rejection is an event emmitted by process object
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);

  console.log('UNHANDLED REJECTION! Shutting down....');

  server.close(() => {
    // 0-> success, 1->uncalled exception
    process.exit(1);
  });
});
