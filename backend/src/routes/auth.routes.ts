import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { loginLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', verifyToken, getMe);

export default router;
