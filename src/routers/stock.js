import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import Stock from '../models/stock.js';
import Portfolio from '../models/portfolio.js';
import StocksInPortfolio from '../models/stocksInPortfolio.js';

dotenv.config();
const router = new express.Router();
const apiKey = process.env.MARKET_STACK_API_KEY;

router.get('/stock/:symbol', async (req, res) => {
    try {
        const date = new Date();
        if (date.getDay() == 0 || date.getDay() == 6) {
            let { data } = await axios.get(
                `http://api.marketstack.com/v1/tickers/${req.params.symbol}/eod?access_key=${apiKey}&limit=1`
            );
            data = data.data;
            const newStock = new Stock({
                symbol: data.symbol,
                name: data.name,
                exchange: data.eod[0].exchange,
                hasIntraday: data.has_intraday,
                hasEod: data.has_eod,
                open: data.eod[0].open,
                close: data.eod[0].close,
                high: data.eod[0].high,
                low: data.eod[0].low,
                last: data.eod[0].last,
                volume: data.eod[0].volume,
                date: data.eod[0].date,
            });
            res.send(newStock);
        } else {
            let { data } = await axios.get(
                `http://api.marketstack.com/v1/tickers/${req.params.symbol}/intraday?access_key=${apiKey}&limit=1`
            );
            data = data.data;
            const newStock = new Stock({
                symbol: data.symbol,
                name: data.name,
                exchange: data.intraday[0].exchange,
                hasIntraday: data.has_intraday,
                hasEod: data.has_eod,
                open: data.intraday[0].open,
                close: data.intraday[0].close,
                high: data.intraday[0].high,
                low: data.intraday[0].low,
                last: data.intraday[0].last,
                volume: data.intraday[0].volume,
                date: data.intraday[0].date,
            });
            res.send(newStock);
        }
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

router.patch('/admin/stocks/update', async (req, res) => {
    try {
        const [{ symbols }] = await StocksInPortfolio.find();
        for (const symbol of symbols) {
            let { data } = await axios.get(
                `http://api.marketstack.com/v1/tickers/${symbol}/intraday?access_key=${apiKey}&limit=1`
            );
            data = data.data;
            await Stock.findOneAndUpdate(symbol, {
                symbol: data.symbol,
                name: data.name,
                exchange: data.intraday[0].exchange,
                hasIntraday: data.has_intraday,
                hasintraday: data.has_intraday,
                open: data.intraday[0].open,
                close: data.intraday[0].close,
                high: data.intraday[0].high,
                low: data.intraday[0].low,
                last: data.intraday[0].last,
                volume: data.intraday[0].volume,
                date: data.intraday[0].date,
            });
        }
        res.status(202).send();
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.get('/admin/stocks_in_portfolios/set', async (req, res) => {
    try {
        let uniqueStocks = [];
        const portfolios = await Portfolio.find();
        for (const portfolio of portfolios) {
            for (const portStock of portfolio.stocks) {
                let exists = false;
                for (const uniqueStock of uniqueStocks) {
                    portStock.symbol == uniqueStock ? (exists = true) : null;
                }
                exists ? null : uniqueStocks.push(portStock.symbol);
            }
        }
        await StocksInPortfolio.deleteMany();
        const doc = new StocksInPortfolio({ symbols: uniqueStocks });
        await doc.save();
        res.send(doc);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});
export default router;
