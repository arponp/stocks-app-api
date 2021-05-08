import { Router } from 'express';
import { getStock, updateStocks } from '../srv/stock.js';

const router = new Router();

router.get('/stock/:symbol', getStock);
router.patch('/stocks/update', updateStocks);

export default router;
