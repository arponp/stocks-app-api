import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
  },
  name: {
    type: String,
  },
  exchange: {
    type: String,
  },
  hasIntraday: {
    type: Boolean,
  },
  hasEod: {
    type: Boolean,
  },
  open: {
    type: Number,
  },
  close: {
    type: Number,
  },
  high: {
    type: Number,
  },
  low: {
    type: Number,
  },
  volume: {
    type: Number,
  },
  date: {
    type: Date,
  },
});

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
