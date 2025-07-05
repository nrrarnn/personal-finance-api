import { Router } from 'express';
import { login } from '../controllers/login';
import { register } from '../controllers/register';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

export default router;