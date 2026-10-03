import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please tell us your name'],
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
    select: false,
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
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// instance method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
  // compare the  user password and encrypted password
};

const User = mongoose.model('User', userSchema);

export default User;
