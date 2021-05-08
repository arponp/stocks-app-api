import mongoose from 'mongoose';

const stockPriceHistorySchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },
    priceHistory: {
        type: Array,
        required: true,
        default: [],
    },
});

const StockPriceHistory = new mongoose.model(
    'StockPriceHistory',
    stockPriceHistorySchema,
    'stock_price_histories'
);

export default StockPriceHistory;
