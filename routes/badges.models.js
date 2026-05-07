import express from "express";
import { Badge, User } from "../models/db.config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const badges = await Badge.findAll();
    res.json(badges);
  } catch (err) {
    next(err);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, { include: [Badge] });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.Badges);
  } catch (err) {
    next(err);
  }
});

router.get("/:badgeId", async (req, res, next) => {
  try {
    const badge = await Badge.findByPk(req.params.badgeId);
    if (!badge) return res.status(404).json({ error: "Badge not found" });
    res.json(badge);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const badge = await Badge.create(req.body);
    res.status(201).json(badge);
  } catch (err) {
    next(err);
  }
});

export default router;
