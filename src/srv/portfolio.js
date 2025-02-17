import Portfolio from '../models/Portfolio.js';
import { validateStock } from './stock.js';
import PortfolioStock from '../models/PortfolioStock.js';

const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ owner: req.user });
        portfolio != null ? res.send(portfolio) : res.status(400).send();
    } catch (e) {
        console.log(e.message);
        res.status(400).send();
    }
};

const buyStocks = async (req, res) => {
    try {
        // check if stocks are valid
        const isValidStock = await validateStock(req.body.symbol);
        if (!isValidStock) {
            res.status(400).send('Invalid stock');
            return;
        }
        const portfolio = await Portfolio.findOne({ owner: req.user });
        portfolio.lastUpdated = new Date();
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
                break;
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
        // update portfolio costs
        portfolio.costs += req.body.quantity * req.body.averageCost;
        await portfolio.save();
        res.status(201).send(portfolio);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
};

const sellStocks = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ owner: req.user });
        portfolio.lastUpdated = new Date();
        if (!portfolio) {
            res.status(400).send('Portfolio not found');
            return;
        }
        // find stock in portfolio and update quantity
        let stockIndex = -1;
        for (let i = 0; i < portfolio.stocks.length; i++) {
            if (portfolio.stocks[i].symbol == req.body.symbol.toUpperCase()) {
                stockIndex = i;
            }
        }
        if (stockIndex == -1) {
            res.status(400).send('Stock not in portfolio');
            return;
        }
        if (portfolio.stocks[stockIndex].quantity - req.body.quantity < 0) {
            res.status(400).send('Overselling quantity');
            return;
        }
        if (portfolio.stocks[stockIndex].quantity - req.body.quantity == 0) {
            console.log('here');
            portfolio.stocks.splice(stockIndex, 1);
        } else {
            portfolio.stocks[stockIndex].quantity -= req.body.quantity;
        }
        portfolio.sales += req.body.quantity * req.body.averageCost;
        await portfolio.save();
        res.status(202).send(portfolio);
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
};

export { getPortfolio, buyStocks, sellStocks };
