import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'thisisstocksapi');
        req.user = decode;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Authentication failed' });
    }
};

export default auth;
