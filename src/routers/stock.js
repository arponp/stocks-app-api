import { Router } from 'express';
import { getStock } from '../srv/stock.js';

const router = new Router();

router.get('/stock/:symbol', getStock);

export default router;
