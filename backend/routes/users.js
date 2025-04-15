import express from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', registerUser);

router.post('/login', loginUser);

router.post('/logout', protect, logoutUser);

router.get('/profile', protect, getUserProfile);

router.put('/profile', protect, updateUserProfile);

router.get('/', protect, authorize('admin'), getUsers);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router; 