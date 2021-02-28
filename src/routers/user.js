import { Router } from "express";
import Portfolio from "../models/portfolio.js";
import User from "../models/user.js";

const router = new Router();

router.post("/users", async (req, res) => {
  // create user
  const user = new User(req.body);
  const portfolio = new Portfolio({
    owner: req.body.email,
    lastUpdated: new Date(),
  });
  try {
    await user.save();
    await portfolio.save();
    res.status(201).send({ user });
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;
