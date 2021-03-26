import { Router } from "express";
import Portfolio, { PortfolioStock } from "../models/portfolio.js";
import auth from "../middleware/auth.js";

const router = new Router();

router.get("/portfolio/:id", async (req, res) => {
  // get portfolio
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id });
    res.send(portfolio);
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/portfolio", auth, async (req, res) => {
  // add to portfolio
  try {
    const portfolio = await Portfolio.findOne({ owner: req.body.owner });
    for (const stock of req.body.stocks) {
      let foundIndex = -1;
      for (let i = 0; i < portfolio.stocks.length; i++) {
        if (portfolio.stocks[i].symbol == stock.symbol) {
          foundIndex = i;
        }
      }
      if (foundIndex == -1) {
        const newStock = new PortfolioStock(stock);
        portfolio.stocks.push(newStock);
      } else {
        portfolio.stocks[foundIndex].quantity += stock.quantity;
      }
    }
    portfolio.lastUpdated = new Date();
    await portfolio.save();
    res.status(201).send(portfolio.stocks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/portfolio/quantity", async (req, res) => {
  // update stock quantity in portfolio
  try {
    const portfolio = await Portfolio.findOne({ owner: req.body.owner });
    for (const stock of req.body.stocks) {
      for (let i = 0; i < portfolio.stocks.length; i++) {
        if (portfolio.stocks[i].symbol == stock.symbol) {
          if (stock.quantity == 0) {
            portfolio.stocks.splice(i, 1);
          } else {
            portfolio.stocks[i].quantity = stock.quantity;
          }
        }
      }
    }
    portfolio.lastUpdated = new Date();
    await portfolio.save();
    res.status(202).send(portfolio.stocks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/portfolio/remove", async (req, res) => {
  // remove stock from portfolio
  try {
    const portfolio = await Portfolio.findOne({ owner: req.body.owner });
    for (let i = 0; i < portfolio.stocks.length; i++) {
      if (portfolio.stocks[i].symbol == req.body.symbol) {
        portfolio.stocks.splice(i, 1);
        break;
      }
    }
    await portfolio.save();
    res.status(202).send(portfolio.stocks);
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;
