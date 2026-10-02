import express from 'express';
import {
  getAllusers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controller/userController.js';
import { login, signUp } from '../controller/authController.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

router.route('/').get(getAllusers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
