import marketStack from '../api/marketStack.js';
import Stock from '../models/stock.js';
import StocksInPortfolio from '../models/stocksInPortfolio.js';

const getStock = async symbol => {
    try {
        const stock = await Stock.findOne({ symbol });
        if (!stock) return null;
        return stock;
    } catch (e) {
        console.error(e);
        return null;
    }
};

const addStock = async symbol => {
    try {
        const StocksInPortfolioCollection = await StocksInPortfolio.find();
        if (StocksInPortfolioCollection[0].symbols.includes(symbol))
            // check if stock is already there
            return null;
        const { status } = await marketStack(`/tickers/${symbol}`);
        if (status != 200) return null; // check if stock exists
        StocksInPortfolioCollection[0].symbols.push(symbol.toUpperCase());
        await StocksInPortfolioCollection[0].save();
        const stock = await updateStock(symbol);
        return stock;
    } catch (e) {
        console.error(e.message);
        return null;
    }
};

const updateStock = async symbol => {
    try {
        // verify that stock is being maintained
        const StocksInPortfolioCollection = await StocksInPortfolio.find();
        if (!StocksInPortfolioCollection[0].symbols.includes(symbol))
            return null;
        // check if stock is already in stock collection
        const stock = await Stock.findOne({ symbol });
        const updatedStock = await getStockFromMarketStack(symbol);
        if (stock) {
            await Stock.findOneAndDelete({ symbol });
        }
        await updatedStock.save();
        return updatedStock;
    } catch (e) {
        console.log(e.message);
        return null;
    }
};

const getStockFromMarketStack = async symbol => {
    let stock;
    const date = new Date();
    // get previous close
    const {
        data: { data },
    } = await marketStack.get(`/tickers/${symbol}/eod?limit=2`);
    const prevClose = data.eod[1].close;
    if (
        date.getDay() == 0 ||
        date.getDay() == 6 ||
        date.getHours() >= 13 ||
        (date.getHours() <= 9 && date.getMinutes() < 30)
    ) {
        const {
            data: { data },
        } = await marketStack.get(`/tickers/${symbol}/eod?limit=1`);
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
        const {
            data: { data },
        } = await marketStack.get(`/tickers/${symbol}/intraday?limit=1`);
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
    return stock;
};

(async () => {
    const stock = await addStock('MARA');
    console.log(stock);
})();

export { getStock };
