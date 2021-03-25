import { Router } from "express";
import Portfolio from "../models/portfolio.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = new Router();

router.post("/users", async (req, res) => {
  // create user
  const hashPass = await bcrypt.hash(req.body.password, 8);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPass,
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

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    let passMatch;
    if (user) {
      passMatch = await bcrypt.compare(req.body.password, user.password);
    } else {
      res.status(400).send({ message: "No user found" });
    }
    if (passMatch) {
      const token = jwt.sign({ _id: user._id.toString() }, "verySecretValue", {
        expiresIn: "1h",
      });
      res.send(token);
    } else {
      res.status(400).send({ message: "No user found" });
    }
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
    await User.findByIdAndDelete(req.params.id);
    await Portfolio.findOneAndDelete({
      owner: req.params.id,
    });
    res.status(202).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;
