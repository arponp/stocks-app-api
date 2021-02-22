import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Stock from '../models/stock.js';

const router = new express.Router();
dotenv.config();


// info about ticker e.g company, exchange, 
// router.get('/stocks/tickers/info', async (req, res) => {
//     try {
//         const { data } = await axios.get(`http://api.marketstack.com/v1/tickers?access_key=${process.env.MARKET_STACK_API_KEY}&symbols=${req.query.symbol}`);
//         let results = { ...data.data[0], price: 50 };
//         res.send(JSON.stringify(results));
//     } catch (e) {
//         res.status(400).send(e);
//     }
// });

// price
// router.get('/stocks/tickers/price', async (req, res) => {
//     try {
//         const date = new Date();
//         const day = date.getDay();
//         let response;
//         if (day == 0 || day == 7) {
//             // eod
//             response = await axios.get(`http://api.marketstack.com/v1/eod?access_key=${process.env.MARKET_STACK_API_KEY}&symbols=${req.query.symbol}`);
//         } else {
//             //intraday
//             response = await axios.get(`http://api.marketstack.com/v1/intraday?access_key=${process.env.MARKET_STACK_API_KEY}&symbols=${req.query.symbol}`);
//         }
//         res.status(200).send(response.data);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// });

export default router;
