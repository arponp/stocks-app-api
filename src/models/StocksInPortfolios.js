import mongoose from 'mongoose';

const stocksInPortfoliosSchema = new mongoose.Schema({
    symbols: {
        type: Array,
        of: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
    },
});

const StocksInPortfolios = mongoose.model(
    'StocksInPortfolio',
    stocksInPortfoliosSchema,
    'stocks_in_portfolios'
);

export default StocksInPortfolios;
