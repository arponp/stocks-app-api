import { Router } from 'express';
import { getPortfolio, addStockToPortfolio } from '../srv/portfolio.js';
import auth from '../middleware/auth.js';

const router = new Router();

router.get('/portfolio', auth, getPortfolio);
router.post('/portfolio', auth, addStockToPortfolio);

export default router;
