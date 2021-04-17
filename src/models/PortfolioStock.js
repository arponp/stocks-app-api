import mongoose from 'mongoose';

const portfolioStockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    averageCost: {
        type: Number,
        required: true,
    },
});

const PortfolioStock = mongoose.model('PortfolioStock', portfolioStockSchema);

export { PortfolioStock as default, portfolioStockSchema };
