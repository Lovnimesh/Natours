import express from 'express';
import {
  getOverview,
  getTour,
  getLoginForm,
} from '../controller/viewsController.js';
import { isLoggedIn } from '../controller/authController.js';

const router = express.Router();

router.use(isLoggedIn);
router.get('/', getOverview);
router.get(`/tour/:slug`, getTour);
router.get('/login', getLoginForm);

export default router;
