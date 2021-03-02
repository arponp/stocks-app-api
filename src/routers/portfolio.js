import { Router } from "express";
import Portfolio, { PortfolioStock } from "../models/portfolio.js";

const router = new Router();

router.get("/portfolio", async (req, res) => {
  // get portfolio
  try {
    const portfolio = await Portfolio.findOne({ owner: req.body.owner });
    res.send(portfolio);
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
      const symbol = stock.symbol.toUpperCase();
      const newStock = PortfolioStock({
        symbol,
        companyName: "corp",
        stockExchangeName: "nyse",
        price: stock.avgCost,
        quantity: stock.quantity,
      });

      portfolio.stocks = { ...portfolio.stocks };
      portfolio.stocks[stock.symbol.toUpperCase()] = "hi";
    }
    await portfolio.save();
    res.send(portfolio.stocks);
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.put("/portfolio", async (req, res) => {
  // edit portfolio
  try {
    for (let stock of req.body.stocks) {
      const portfolio = await Portfolio.findOne({ owner: req.body.owner });
    }
  } catch (e) {
    res.status(400).send();
  }
});

// router.delete("/portfolio/stock", async (req, res) => {
//   // remove stock from portfolio
//   try {
//     const portfolio = await Portfolio.findOne({ owner: req.body.owner });
//     portfolio.lastUpdated = new Date();
//     delete portfolio.stocks[req.body.symbol.toUpperCase()];
//     await
//   } catch (e) {
//     res.status(400).send();
//   }
// });

export default router;
