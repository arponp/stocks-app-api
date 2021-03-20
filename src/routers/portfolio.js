import { Router } from "express";
import Portfolio, { PortfolioStock } from "../models/portfolio.js";

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

router.post("/portfolio", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ owner: req.body.owner });
    for (const stock of req.body.stocks) {
      // check if ticker already exists
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
    await portfolio.save();
    res.send(portfolio.stocks);
  } catch (e) {
    res.status(400).send(e);
  }
});
export default router;
