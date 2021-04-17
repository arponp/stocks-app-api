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
});

portfolioSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.owner;

    return userObject;
};

const Portfolio = mongoose.model('Portfolio', portfolioSchema, 'portfolios');

export default Portfolio;
