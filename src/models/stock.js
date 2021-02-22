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
    }
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;

