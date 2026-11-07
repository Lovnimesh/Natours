import express from 'express';
import {
  getAllusers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} from '../controller/userController.js';
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  restrictTo,
  signUp,
  updatePassword,
} from '../controller/authController.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// from here routes are restricted to user
router.use(restrictTo('admin'));

router.route('/').get(getAllusers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
