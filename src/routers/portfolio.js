import { Router } from 'express';
import { getPortfolio, buyStocks } from '../srv/portfolio.js';
import auth from '../middleware/auth.js';

const router = new Router();

router.get('/portfolio', auth, getPortfolio);
router.patch('/portfolio/add', auth, buyStocks);
// router.patch('/portfolio/sell', auth, sellStockFromPortfolio);

export default router;
