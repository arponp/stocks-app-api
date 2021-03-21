import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  exchange: {
    type: String,
    required: true,
  },
  hasIntraday: {
    type: Boolean,
    required: true,
  },
  hasEod: {
    type: Boolean,
    required: true,
  },
  open: {
    type: Number,
    required: true,
  },
  close: {
    type: Number,
    required: true,
  },
  high: {
    type: Number,
    required: true,
  },
  low: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Stock = mongoose.model("Stock", stockSchema, "stocks");

export default Stock;
