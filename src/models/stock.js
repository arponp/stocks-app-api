import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: false,
  },
  stockExchangeName: {
    type: String,
    required: false,
  },
});

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
