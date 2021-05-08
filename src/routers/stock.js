import { Router } from 'express';
import { getStock, updateStocks } from '../srv/stock.js';

const router = new Router();

router.get('/stock/:symbol', getStock);
router.patch('/stocks/update', async (req, res) => {
    try {
        const updates = await updateStocks();
        updates ? res.send(updates) : res.status(400).send('error');
    } catch (e) {
        res.status(400).send();
    }
});

export default router;
