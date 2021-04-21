import StocksInPortfolios from '../models/StocksInPortfolios.js';
import marketStack from '../api/marketStack.js';

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

const getStocksInPortfolios = async () => {
    try {
        const stocksInPortfoliosCollection = await StocksInPortfolios.find();
        const stocksInPortfolios = stocksInPortfoliosCollection[0];
        return stocksInPortfolios;
    } catch (e) {
        console.log(e.message);
        return null;
    }
};

export { addStockToStocksInPortfolios, getStocksInPortfolios };
