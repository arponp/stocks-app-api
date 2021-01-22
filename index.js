import Express from 'express';

const app = Express();

const port = process.env.port || 3000;

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

app.listen(port, () => console.log(`Listening on port ${port}`));