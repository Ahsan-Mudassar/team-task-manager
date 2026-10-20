import { Router } from 'express';
import validate from '../middlewares/validate.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';
import { register, login, logout, me } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', isAuthenticated, logout);
router.get('/me', isAuthenticated, me);

export default router;