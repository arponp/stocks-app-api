import mongoose from 'mongoose';

export const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    net: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Transaction = new mongoose.model('Transaction', transactionSchema);

export default Transaction;
