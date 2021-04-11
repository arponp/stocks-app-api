import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import Stock from '../models/stock.js';
import Portfolio from '../models/portfolio.js';
import StocksInPortfolio from '../models/stocksInPortfolio.js';

dotenv.config();
const router = new express.Router();
const apiKey = process.env.MARKET_STACK_API_KEY;
const stocksInPortfolioId = process.env.STOCK_IN_PORTFOLIO_ID;

router.get('/stock/:symbol', async (req, res) => {
    try {
        let stock = await Stock.findOne({ symbol: req.params.symbol });
        if (!stock) {
            await axios.post(
                'http://localhost:4000/admin/stocks_in_portfolios/add',
                {
                    symbols: [req.params.symbol],
                }
            );
            await axios.patch('http://localhost:4000/admin/stocks/update');
        }
        stock = await Stock.findOne({ symbol: req.params.symbol });
        res.send(stock);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

router.patch('/admin/stocks/update', async (req, res) => {
    try {
        await Stock.deleteMany();
        const [{ symbols }] = await StocksInPortfolio.find();
        for (const symbol of symbols) {
            let stock;
            const date = new Date();
            // get previous close
            const {
                data: { data },
            } = await axios.get(
                `http://api.marketstack.com/v1/tickers/${symbol}/eod?access_key=${apiKey}&limit=2`
            );
            const prevClose = data.eod[1].close;
            if (
                date.getDay() == 0 ||
                date.getDay() == 6 ||
                date.getHours() >= 13 ||
                (date.getHours() <= 9 && date.getMinutes() < 30)
            ) {
                const {
                    data: { data },
                } = await axios.get(
                    `http://api.marketstack.com/v1/tickers/${symbol}/eod?access_key=${apiKey}&limit=1`
                );
                stock = new Stock({
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
                    prevClose,
                });
            } else {
                let { data } = await axios.get(
                    `http://api.marketstack.com/v1/tickers/${req.params.symbol}/intraday?access_key=${apiKey}&limit=1`
                );
                data = data.data;
                stock = new Stock({
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
                    prevClose,
                });
            }
            await stock.save();
            console.log(stock);
        }
        res.status(202).send();
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.get('/admin/stocks_in_portfolios/update', async (req, res) => {
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
        const doc = new StocksInPortfolio({
            symbols: uniqueStocks,
            lastUpdated: new Date(),
        });
        await doc.save();
        res.send(doc);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
});

router.post('/admin/stocks_in_portfolios/add', async (req, res) => {
    try {
        const symbols = req.body.symbols;
        const stocksInPortfolio = await StocksInPortfolio.findById(
            stocksInPortfolioId
        );
        stocksInPortfolio.symbols = stocksInPortfolio.symbols.concat(symbols);
        stocksInPortfolio.lastUpdated = new Date();
        await stocksInPortfolio.save();
        res.send(stocksInPortfolio);
    } catch (e) {
        console.log(e.message);
        res.status(400).send();
    }
});

export default router;
