import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';

const signUp = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  // there is a security flow saving the user data like this because any one can assign himself.herself admin role

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // signing the JWT
  // jwt.sign(payload, secret, {options(expiresin)});
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user exists && password is correct

  // since we have excluded the field password in schema, here we need, so we use 'select' method to allow the field
  const user = await User.findOne({ email }).seclect('+password');

  // 3) If everything ok, send token to client
  const token = ;
  res.status(200).json({
    status: 'success',
    token,
  });
});

export { signUp, login };
