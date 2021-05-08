import StockHistory from '../models/StockHistory.js';

const getStockHistory = async symbol => {
    try {
        const stockHistory = await StockHistory.findOne({
            symbol: symbol.toUpperCase(),
        });
        return stockHistory != null ? stockHistory : null;
    } catch (e) {
        console.log(e.message);
        return null;
    }
};

const createStockHistory = async (symbol, initialPrice, date) => {
    try {
        const newStockHistory = new StockHistory({
            symbol,
            priceHistory: [{ price: initialPrice, date }],
        });
        await newStockHistory.save();
        return newStockHistory;
    } catch (e) {
        console.log(e.message);
        return null;
    }
};

const addStockPrice = async (symbol, price, date) => {
    try {
        const stockHistory = await getStockHistory(symbol);
        stockHistory.priceHistory.push({ price, date });
        await stockHistory.save();
        return stockHistory;
    } catch (e) {
        console.log(e.message);
        return null;
    }
};

export { getStockHistory, createStockHistory, addStockPrice };
