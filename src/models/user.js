import mongoose from 'mongoose';

const User = mongoose.model('User', {
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

export default User;



