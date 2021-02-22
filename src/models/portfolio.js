import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    stockExchangeName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const portfolioSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    stocks: [stockSchema],
    lastUpdated: {
        type: Date,
        required: true
    }
});

const Portfolio = mongoose.model('Portfolio',portfolioSchema);

export default Portfolio;