import { Router } from 'express';
import Portfolio from '../models/portfolio.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.js';

const router = new Router();

router.post('/users', async (req, res) => {
    try {
        // create user
        const hashPass = await bcrypt.hash(req.body.password, 8);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPass,
        });
        const portfolio = new Portfolio({
            owner: user._id,
            lastUpdated: new Date(),
        });
        const token = await user.generateAuthToken();
        await user.save();
        await portfolio.save();
        res.status(201).send({ user, token });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const passMatch = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (passMatch) {
                const token = await user.generateAuthToken();
                res.send({ user, token });
                return;
            }
            res.status(400).send({ message: 'Invalid password' });
        }
        res.status(400).send({ message: 'Invalid email' });
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

router.get('/user', auth, async (req, res) => {
    // get user
    try {
        const user = await User.findOne({ _id: req.user });
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/user/:id', async (req, res) => {
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
