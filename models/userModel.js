import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please tell use your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    // password with longer length is more secure than the password with smaller length and special character, digit and capital
  },
  photo: {
    type: String,
  },
  passwordConfirm: {
    type: String,
    reuire: [true, 'Please confirm your password'],
  },
});

const User = mongoose.Model('User', userSchema);

export default User;
