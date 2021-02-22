import express from 'express';
import cors from 'cors'
import stockRouter from './routers/stock.js';
import userRouter from './routers/user.js';
import './db/mongoose.js';

const app = express();

const port = process.env.port || 4000;

app.use(cors());
app.use(express.json())
app.use(stockRouter);
app.use(userRouter);

app.get('/', (req, res) => res.status(200).send('Hello World'));

app.listen(port, () => console.log(`Listening on port ${port}`));