import { Router } from "express";
import User from '../models/user.js';

const router = new Router();

router.post('/users', async (req,res) => { // create user 
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send({user});
    } catch (e) {
        res.status(400).send(e);
    }
});

export default router;