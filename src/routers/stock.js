import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import Stock from "../models/stock.js";

dotenv.config();
const router = new express.Router();
const apiKey = process.env.MARKET_STACK_API_KEY;

router.get("/stock/:symbol", async (req, res) => {
  try {
    console.log(req.params.symbol);
    const stock = await Stock.findOne({
      symbol: req.params.symbol.toUpperCase(),
    });
    res.send(stock);
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.get("/admin/tickers", async (req, res) => {
  try {
    await Stock.deleteMany({});
    const { data } = await axios.get(
      "https://pkgstore.datahub.io/core/s-and-p-500-companies/constituents_json/data/0e5db1e7676fbd54248b1de218b5a908/constituents_json.json"
    );

    for (const company of data) {
      const stock = new Stock({
        symbol: company.Symbol,
        companyName: company.Name,
      });

      await stock.save();
    }
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.get("/admin/data", async (req, res) => {
  try {
    const data = await Stock.find();
    const tickers = [];
    for (let i = 0; i < data.length; i++) {
      tickers.push(data[i].symbol);
    }
    res.send(tickers);
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

export default router;
