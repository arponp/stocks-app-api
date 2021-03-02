import mongoose from "mongoose";

const portfolioStockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  stockExchangeName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
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
  //   stocks: [portfolioStockSchema],
  stocks: {
    type: Map,
    of: String,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
const PortfolioStock = mongoose.model("PortfolioStock", portfolioStockSchema);

export { Portfolio as default, PortfolioStock };
