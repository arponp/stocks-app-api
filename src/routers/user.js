import { Router } from 'express';
import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { createUser, login } from '../srv/user.js';

const router = new Router();

router.post('/users', createUser);

router.post('/users/login', login);

router.delete('/user', auth, async (req, res) => {
    // delete user
    try {
        await User.findByIdAndDelete(req.params.id);
        await Portfolio.findOneAndDelete({
            owner: req.params.id,
        });
        res.status(202).send();
    } catch (e) {
        res.status(400).send(e);
    }
});

export default router;
