import { Router } from "express";
import Portfolio from "../models/portfolio.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const router = new Router();

router.post("/users", async (req, res) => {
  // create user
  const password = await bcrypt.hash(req.body.password, 8);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password,
  });
  const portfolio = new Portfolio({
    owner: user._id,
    lastUpdated: new Date(),
  });
  try {
    await user.save();
    await portfolio.save();
    res.status(201).send({ id: user._id });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/user/:id", async (req, res) => {
  // get user
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/user/:id", async (req, res) => {
  // delete user
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    const portfolio = await Portfolio.findOneAndDelete({
      owner: req.params.id,
    });
    console.log(user);
    console.log(portfolio);
    res.status(202).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;
