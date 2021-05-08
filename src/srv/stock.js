import marketStack from '../api/marketStack.js';
import Stock from '../models/Stock.js';
import {
    addStockToStocksInPortfolios,
    getStocksInPortfolios,
} from './stocksInPortfolios.js';
import {
    getStockHistory,
    createStockHistory,
    addStockPrice,
} from './stockHistory.js';

const getStock = async (req, res) => {
    try {
        let stock = await Stock.findOne({ symbol: req.params.symbol });
        if (!stock) {
            stock = await addStock(req.params.symbol);
        }
        !stock ? res.status(400).send() : res.send(stock);
    } catch (e) {
        console.log(e.message);
        res.status(400).send();
    }
};

const updateStocks = async () => {
    try {
        const { symbols } = await getStocksInPortfolios();
        const updates = [];
        for (const symbol of symbols) {
            const update = await updateStock(symbol);
            updates.push(update);
        }
        return updates;
    } catch (e) {
        console.log(e.message);
        return null;
    }
};

const updateStock = async symbol => {
    try {
        const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
        if (!stock) {
            console.log('No stock found');
            return null;
        }
        const newStock = await createUpdateDocument(symbol.toUpperCase());
        const update = await stock.updateOne(newStock);
        return update ? update : null;
    } catch (e) {
        console.log(e.message);
        return null;
    }
};

const addStock = async symbol => {
    try {
        const updatedStocksInPortfolios = await addStockToStocksInPortfolios(
            symbol
        );
        if (updatedStocksInPortfolios == null) {
            return null;
        }
        const newStockDocument = await createStockDocument(symbol);
        return newStockDocument;
    } catch (e) {
        console.log(e.message);
        return null;
    }
};

const validateStock = async symbol => {
    try {
        const stock = await Stock.findOne({ symbol });
        if (stock) return true;
        const { status } = await marketStack.get(`/tickers/${symbol}`);
        if (status != 200) return null;
        await addStock(symbol);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

const createStockDocument = async symbol => {
    let stock;
    const date = new Date();
    if (
        date.getDay() == 0 ||
        date.getDay() == 6 ||
        date.getHours() >= 13 ||
        (date.getHours() <= 9 && date.getMinutes() < 30)
    ) {
        const {
            data: { data },
        } = await marketStack.get(`/tickers/${symbol}/eod?limit=2`);
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
            prevClose: data.eod[1].close,
        });
        const stockHistory = await createStockHistory(
            stock.symbol,
            stock.close,
            stock.date
        );
        console.log(stockHistory);
    } else {
        const req1 = await marketStack.get(`/tickers/${symbol}/eod?limit=2`);
        const req2 = await marketStack.get(
            `/tickers/${symbol}/intraday?limit=1`
        );
        stock = new Stock({
            symbol: req2.data.data.symbol,
            name: req2.data.data.name,
            exchange: req2.data.data.intraday[0].exchange,
            hasIntraday: req2.data.data.has_intraday,
            hasEod: req2.data.data.has_eod,
            open: req2.data.data.intraday[0].open,
            close: req2.data.data.intraday[0].close,
            high: req2.data.data.intraday[0].high,
            low: req2.data.data.intraday[0].low,
            last: req2.data.data.intraday[0].last,
            volume: req2.data.data.intraday[0].volume,
            date: req2.data.data.intraday[0].date,
            prevClose: req1.data.data.eod[1].close,
        });
        const stockHistory = await createStockHistory(
            stock.symbol,
            stock.last,
            stock.date
        );
        console.log(stockHistory);
    }
    await stock.save();
    return stock;
};

const createUpdateDocument = async symbol => {
    let stock;
    const date = new Date();

    if (
        date.getDay() == 0 ||
        date.getDay() == 6 ||
        date.getHours() >= 13 ||
        (date.getHours() <= 9 && date.getMinutes() < 30)
    ) {
        const {
            data: { data },
        } = await marketStack.get(`/tickers/${symbol}/eod?limit=2`);
        stock = {
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
            prevClose: data.eod[1].close,
        };
        const stockHistory = await addStockPrice(
            stock.symbol,
            stock.close,
            stock.date
        );
        console.log(stockHistory);
    } else {
        const req1 = await marketStack.get(`/tickers/${symbol}/eod?limit=2`);
        const req2 = await marketStack.get(
            `/tickers/${symbol}/intraday?limit=1`
        );
        stock = {
            symbol: req2.data.data.symbol,
            name: req2.data.data.name,
            exchange: req2.data.data.intraday[0].exchange,
            hasIntraday: req2.data.data.has_intraday,
            hasEod: req2.data.data.has_eod,
            open: req2.data.data.intraday[0].open,
            close: req2.data.data.intraday[0].close,
            high: req2.data.data.intraday[0].high,
            low: req2.data.data.intraday[0].low,
            last: req2.data.data.intraday[0].last,
            volume: req2.data.data.intraday[0].volume,
            date: req2.data.data.intraday[0].date,
            prevClose: req1.data.data.eod[1].close,
        };
        const stockHistory = await addStockPrice(
            stock.symbol,
            stock.last,
            stock.date
        );
        console.log(stockHistory);
    }
    return stock;
};

export { getStock, validateStock, updateStock, updateStocks };
