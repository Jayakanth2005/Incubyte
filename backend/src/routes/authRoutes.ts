import { Router } from 'express';
import { AuthController, authValidation } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', authValidation.register, validate, AuthController.register);
router.post('/login', authValidation.login, validate, AuthController.login);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);

export default router;
