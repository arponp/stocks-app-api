import mongoose from 'mongoose';

const Stock = mongoose.model('Stock', {
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.model,
        required: true,
        ref: 'User'
    }
});

export default Stock;
