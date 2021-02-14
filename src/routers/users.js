import { Router } from "express";
import User from '../models/user.js';

const router = new Router();

router.get('/users', async (req,res) => {

    User.find({}, function (err, users) {
        res.send(users);
    });

    
});

export default router;