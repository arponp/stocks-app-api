import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import Stock from "../models/stock.js";
import Portfolio from "../models/portfolio.js";

dotenv.config();
const router = new express.Router();
const apiKey = process.env.MARKET_STACK_API_KEY;

router.get("/stock/:symbol", async (req, res) => {
  try {
    let { data } = await axios.get(
      `http://api.marketstack.com/v1/tickers/${req.params.symbol}/eod?access_key=${apiKey}&limit=1`
    );
    data = data.data;
    const newStock = new Stock({
      symbol: data.symbol,
      name: data.name,
      exchange: data.eod[0].exchange,
      hasIntraday: data.has_intraday,
      hasEod: data.has_eod,
      open: data.eod[0].open,
      close: data.eod[0].close,
      high: data.eod[0].high,
      low: data.eod[0].low,
      volume: data.eod[0].volume,
      date: data.eod[0].date,
    });
    res.send(newStock);
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.patch("/admin/update/collection", async (req, res) => {
  try {
    let uniqueStocks = [];
    const portfolios = await Portfolio.find();
    for (const portfolio of portfolios) {
      for (const portStock of portfolio.stocks) {
        let exists = false;
        for (const uniqueStock of uniqueStocks) {
          portStock.symbol == uniqueStock ? (exists = true) : null;
        }
        exists ? null : uniqueStocks.push(portStock.symbol);
      }
    }
    await Stock.deleteMany();
    for (const stock of uniqueStocks) {
      let { data } = await axios.get(
        `http://api.marketstack.com/v1/tickers/${stock}/eod?access_key=${apiKey}&limit=1`
      );
      data = data.data;
      console.log(data);
      const newStock = new Stock({
        symbol: data.symbol,
        name: data.name,
        exchange: data.eod[0].exchange,
        hasIntraday: data.has_intraday,
        hasEod: data.has_eod,
        open: data.eod[0].open,
        close: data.eod[0].close,
        high: data.eod[0].high,
        low: data.eod[0].low,
        volume: data.eod[0].volume,
        date: data.eod[0].date,
      });
      await newStock.save();
    }
    res.status(202).send();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

export default router;
