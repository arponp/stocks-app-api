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

export { getStockHistory };
