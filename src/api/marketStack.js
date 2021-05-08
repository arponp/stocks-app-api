import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const accessKey = process.env.MARKET_STACK_API_KEY;

export default axios.create({
    baseURL: 'http://api.marketstack.com/v1',
    params: {
        access_key: accessKey,
    },
});
