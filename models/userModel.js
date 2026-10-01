import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

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
    validate: {
      // custom validator only works on CREATE & SAVE!!!
      validator: function (el) {
        return this.password === el;
      },
      message: 'password are not same',
    },
  },
});

userSchema.pre('save', async function (next) {
  // only while there is an update in password not in other changes
  // for that mongoose have 'isModified' method
  if (!this.isModified('password')) return next();
  // we will use a famous hashing algorithm, i.e. "Bcrypt"
  this.password = await bcrypt.hash(this.password, 12);

  //  delete confirm password field, since we only need it when the user set the  password to verify that  first input is same
  this.passwordConfirm = undefined;

  next();
});
const User = mongoose.model('User', userSchema);

export default User;
