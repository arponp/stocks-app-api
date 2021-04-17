import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import bcrypt from 'bcryptjs';

const createUser = async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 8),
        });
        const portfolio = new Portfolio({
            owner: user._id,
            lastUpdated: new Date(),
        });
        const token = await user.generateAuthToken();
        await user.save();
        await portfolio.save();
        res.status(202).send({ user, token });
    } catch (e) {
        console.log(e.message);
        res.status(400).send();
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const passMatch = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (passMatch) {
                const token = await user.generateAuthToken();
                res.send({ token });
            }
            res.status(400).send({ message: 'Invalid Password' });
        }
        res.status(400).send({ message: 'Invalid email' });
    } catch (e) {
        console.log(e.message);
        return null;
    }
};

export { createUser, login };
