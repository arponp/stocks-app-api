import express from 'express';
import cors from 'cors'
import stockRouter from './routers/stocks.js';
import userRouter from './routers/users.js';
import './db/mongoose.js';

const app = express();

const port = process.env.port || 4000;

app.use(cors());
app.use(stockRouter);
app.use(userRouter);

app.get('/', (req, res) => res.status(200).send('Hello World'));

app.listen(port, () => console.log(`Listening on port ${port}`));