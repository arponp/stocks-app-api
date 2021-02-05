import express from 'express';
import stockRouter from './routers/stocks.js';

const app = express();

const port = process.env.port || 3000;

app.use(stockRouter);

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

app.listen(port, () => console.log(`Listening on port ${port}`));