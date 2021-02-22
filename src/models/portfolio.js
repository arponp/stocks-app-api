import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
    stocks: [
        {
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
        }
    ],
    lastUpdated: {
        type: Date,
        required: true
    }
});

const Portfolio = mongoose.model('Portfolio',portfolioSchema);

export default Portfolio;