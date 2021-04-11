import mongoose from 'mongoose';

const stocksInPortfolioSchema = new mongoose.Schema({
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

const StocksInPortfolio = mongoose.model(
    'StocksInPortfolio',
    stocksInPortfolioSchema,
    'stocks_in_portfolios'
);

export default StocksInPortfolio;
