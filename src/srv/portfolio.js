import Portfolio from '../models/Portfolio.js';
import { validateStock } from './stock.js';
import PortfolioStock from '../models/PortfolioStock.js';

const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ owner: req.user });
        portfolio != null ? res.send(portfolio) : res.status(400).send();
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
};

const addStockToPortfolio = async (req, res) => {
    try {
        // check if stocks are valid
        const isValidStock = await validateStock(req.body.symbol);
        if (!isValidStock) {
            res.status(400).send('Invalid stock');
            return;
        }
        const portfolio = await Portfolio.findOne({ owner: req.user });
        // check if stock is already there
        let found = false;
        let foundIndex;
        for (let i = 0; i < portfolio.stocks.length; i++) {
            if (
                portfolio.stocks[i].symbol.toUpperCase() ==
                req.body.symbol.toUpperCase()
            ) {
                foundIndex = i;
                found = true;
            }
        }
        if (found) {
            // modify portfolio stock
            const portfolioStock = portfolio.stocks[foundIndex];
            portfolioStock.averageCost =
                (req.body.quantity * req.body.averageCost +
                    portfolioStock.quantity * portfolioStock.averageCost) /
                (req.body.quantity + portfolioStock.quantity);
            portfolioStock.quantity += req.body.quantity;
            await portfolio.save();
        } else {
            // add new Portfolio Stock
            const portfolioStock = new PortfolioStock({
                symbol: req.body.symbol.toUpperCase(),
                quantity: req.body.quantity,
                averageCost: req.body.averageCost,
            });
            portfolio.stocks.push(portfolioStock);
            await portfolio.save();
        }
        res.status(201).send(portfolio.stocks);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
};

export { getPortfolio, addStockToPortfolio };
