import marketStack from '../api/marketStack.js';
import Stock from '../models/Stock.js';
import StocksInPortfolios from '../models/StocksInPortfolios.js';

const getStock = async (req, res) => {
    try {
        let stock = await Stock.findOne({ symbol: req.params.symbol });
        if (!stock) {
            stock = await addStock(req.params.symbol);
        }
        res.send(stock);
    } catch (e) {
        console.log(e.message);
        res.status(400).send();
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
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

const addStockToStocksInPortfolios = async symbol => {
    // function adds symbol to maintained symbols
    try {
        // get stocks in portfolios
        const stocksInPortfoliosCollection = await StocksInPortfolios.find();
        const stocksInPortfolios = stocksInPortfoliosCollection[0];
        stocksInPortfolios.lastUpdated = new Date();
        // check if already there
        let found = false;
        for (const checkSymbol of stocksInPortfolios.symbols) {
            checkSymbol == symbol.toUpperCase() ? (found = true) : null;
        }
        if (found) return null;
        // validate existence of symbol
        const { status } = await marketStack.get(`/tickers/${symbol}`);
        if (status != 200) return null;
        // add to symbols array
        stocksInPortfolios.symbols.push(symbol.toUpperCase());
        await stocksInPortfolios.save();
        return stocksInPortfolios.symbols;
    } catch (e) {
        console.log(e.message);
        return null;
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
    }
    await stock.save();
    return stock;
};

export { getStock, validateStock };
