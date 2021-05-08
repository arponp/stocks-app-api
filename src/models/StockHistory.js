import mongoose from 'mongoose';

const stockHistorySchema = new mongoose.Schema({
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

const StockHistory = new mongoose.model(
    'StockHistory',
    stockHistorySchema,
    'stock_histories'
);

export default StockHistory;
