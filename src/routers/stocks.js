import express from "express";
import axios from "axios";
const router = new express.Router();

// info about ticker e.g company, exchange, 
router.get('/stocks/tickers/info', async (req, res) => {
    try {
        const response = await axios.get(`http://api.marketstack.com/v1/tickers?access_key=22f7bd893eabb35ec7875a31ca051a7f&symbols=${req.query.symbol}`);
        res.send(response.data);
    } catch (e) {
        res.status(400).send(e);
    }
});

//price
router.get('/stocks/tickers/price', async (req, res) => {
    try {
        const date = new Date();
        const day = date.getDay();
        let response;
        if (day == 0 || day == 7) {
            // eod
            response = await axios.get(`http://api.marketstack.com/v1/eod?access_key=22f7bd893eabb35ec7875a31ca051a7f&symbols=${req.query.symbol}`);
        } else {
            //intraday
            response = await axios.get(`http://api.marketstack.com/v1/intraday?access_key=22f7bd893eabb35ec7875a31ca051a7f&symbols=${req.query.symbol}`);
        }
        res.status(200).send(response.data);
    } catch (e) {
        res.status(400).send(e);
    }
});

export default router;
