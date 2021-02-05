import express from "express";
import got from "got";
const router = new express.Router();


router.get('/stocks/:ticker', async (req, res) => {
    try {
        const response = await got(`http://api.marketstack.com/v1/eod?access_key=22f7bd893eabb35ec7875a31ca051a7f&symbols=${req.params.ticker}`);
        res.send(response);
    } catch (e) {
        res.status(400).send(e);
    }
});

export default router;
