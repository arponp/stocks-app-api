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

export default router;
