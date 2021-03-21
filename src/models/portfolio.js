import mongoose from "mongoose";

const portfolioStockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const portfolioSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
  stocks: [portfolioStockSchema],
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema, "portfolios");
const PortfolioStock = mongoose.model("PortfolioStock", portfolioStockSchema);

export { Portfolio as default, PortfolioStock };
