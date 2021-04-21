import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createUser, login, deleteUser } from '../srv/user.js';

const router = new Router();

router.post('/users', createUser);

router.post('/users/login', login);

router.delete('/user', auth, deleteUser);

export default router;
