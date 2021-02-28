import { Router } from "express";
import Portfolio, { PortfolioStock } from "../models/portfolio.js";

const router = new Router();

router.get("/portfolio", async (req, res) => {
  // get portfolio
  try {
    const portfolio = await Portfolio.findOne({ owner: req.body.owner });
    res.send(portfolio.stocks);
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/portfolio", async (req, res) => {
  // add Stock to portfolio
  try {
    const portfolio = await Portfolio.findOne({ owner: req.body.owner });
    portfolio.lastUpdated = new Date();
    for (let stock of req.body.stocks) {
      const newStock = PortfolioStock({
        symbol: stock.symbol.toUpperCase(),
        companyName: "corp",
        stockExchangeName: "nyse",
        price: stock.avgCost,
        quantity: stock.quantity,
      });
      portfolio.stocks.push(newStock);
    }
    await portfolio.save();
    res.send(portfolio);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/portfolio", async (req, res) => {
  // remove stock from portfolio
  try {
    const portfolio = await Portfolio.findOne({ owner: req.body.owner });
    portfolio.lastUpdated = new Date();
    portfolio.stocks = portfolio.stocks.filter((stock) => {
      return stock.symbol != req.body.symbol;
    });
    await portfolio.save();
    res.send(portfolio);
  } catch (e) {
    res.status(400).send();
  }
});

export default router;
