import mongoose from 'mongoose';
import { portfolioStockSchema } from './PortfolioStock.js';

const portfolioSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
    },
    stocks: {
        type: Array,
        of: portfolioStockSchema,
        required: true,
    },
    sales: {
        type: Number,
        required: true,
        default: 0,
    },
    costs: {
        type: Number,
        required: true,
        default: 0,
    },
});

portfolioSchema.methods.toJSON = function () {
    const portfolio = this;
    const portfolioObject = portfolio.toObject();

    delete portfolioObject.owner;

    return portfolioObject;
};

const Portfolio = mongoose.model('Portfolio', portfolioSchema, 'portfolios');

export default Portfolio;
