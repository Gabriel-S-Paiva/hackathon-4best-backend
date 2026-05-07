import express from "express";
import { Feed } from "../models/db.config.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const feed = await Feed.findAll({ where: { isPublic: true } });
    res.json(feed);
  } catch (err) {
    next(err);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  try {
    const feed = await Feed.findAll({ where: { userId: req.params.userId } });
    res.json(feed);
  } catch (err) {
    next(err);
  }
});

router.get("/:feedId", async (req, res, next) => {
  try {
    const feedItem = await Feed.findByPk(req.params.feedId);
    if (!feedItem) return res.status(404).json({ error: "Feed item not found" });
    res.json(feedItem);
  } catch (err) {
    next(err);
  }
});

export default router;
